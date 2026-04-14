import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { beforeTest } from './common';

test.beforeEach(beforeTest);

test('SVG download includes foreignObject content and preserves hidden bookmark styling', async ({
  page,
}) => {
  await page.goto(
    'http://localhost:3000/?workspace=Upset+Examples&table=simpsons&sessionId=193',
  );

  await page.evaluate(() => {
    const svgDownloadState = window as typeof window & {
      __capturedSvgBlob?: Blob;
      __originalCreateObjectURL?: typeof URL.createObjectURL;
      __originalAnchorClick?: typeof HTMLAnchorElement.prototype.click;
    };

    svgDownloadState.__originalCreateObjectURL = URL.createObjectURL;
    svgDownloadState.__originalAnchorClick = HTMLAnchorElement.prototype.click;

    URL.createObjectURL = ((object: Blob | MediaSource) => {
      if (object instanceof Blob && object.type === 'image/svg+xml') {
        svgDownloadState.__capturedSvgBlob = object;
      }

      return 'blob:captured-svg';
    }) as typeof URL.createObjectURL;

    HTMLAnchorElement.prototype.click = () => {};
  });

  await page.getByLabel('Additional options menu').click();
  await page.getByRole('menuitem', { name: 'SVG Download of this upset plot' }).click();

  const exportDetails = await page.evaluate(async () => {
    const svgDownloadState = window as typeof window & {
      __capturedSvgBlob?: Blob;
      __originalCreateObjectURL?: typeof URL.createObjectURL;
      __originalAnchorClick?: typeof HTMLAnchorElement.prototype.click;
    };

    const svgText = await svgDownloadState.__capturedSvgBlob?.text();

    if (svgDownloadState.__originalCreateObjectURL) {
      URL.createObjectURL = svgDownloadState.__originalCreateObjectURL;
    }

    if (svgDownloadState.__originalAnchorClick) {
      HTMLAnchorElement.prototype.click = svgDownloadState.__originalAnchorClick;
    }

    if (!svgText) {
      return {
        foreignObjectCount: 0,
        xhtmlNodeCount: 0,
        hiddenMuiIconCount: 0,
      };
    }

    const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
    const hiddenMuiIconCount = Array.from(
      doc.querySelectorAll('svg.MuiSvgIcon-root'),
    ).filter((icon) =>
      /(?:opacity|fill-opacity):\s*0(?:;|$)/.test(icon.getAttribute('style') ?? ''),
    ).length;

    return {
      foreignObjectCount: doc.querySelectorAll('foreignObject').length,
      xhtmlNodeCount: Array.from(doc.querySelectorAll('foreignObject *')).filter(
        (element) => element.getAttribute('xmlns') === 'http://www.w3.org/1999/xhtml',
      ).length,
      hiddenMuiIconCount,
    };
  });

  expect(exportDetails.foreignObjectCount).toBeGreaterThan(0);
  expect(exportDetails.xhtmlNodeCount).toBeGreaterThan(0);
  expect(exportDetails.hiddenMuiIconCount).toBeGreaterThan(0);
});

/**
 * Toggles the advanced scale slider. Must be awaited
 * @param page page provided to test function
 */
async function toggleAdvancedScale(page: Page) {
  await page.getByText('Size', { exact: true }).click({
    button: 'right',
    force: true,
  });
  await page.getByRole('menuitem', { name: 'Toggle Advanced Scale' }).click();
}

/**
 * Removes a visible set by name. Must be awaited
 * @param page page provided to test
 * @param setName name of set
 */
async function removeSetByName(page: Page, setName: string) {
  await page
    .locator('p')
    .filter({ hasText: new RegExp(`^${setName}$`) })
    .click({ button: 'right' });
  await page.getByRole('menuitem', { name: `Remove Set: ${setName}` }).click();
}

/**
 * Adds an invisible set by name. Must be awaited
 * @param page page provided to test
 * @param setName name of set
 */
async function addSetByName(page: Page, setName: string) {
  await page.getByText(setName, { exact: true }).click({
    button: 'right',
  });
  await page.getByRole('menuitem', { name: `Add Set: ${setName}` }).click();
}

/**
 * Asserts that the max value of the size scale is equal to the given max value
 * @param page page provided to test
 * @param max max value to assert
 */
async function assertSizeScaleMax(page: Page, max: number) {
  await expect(
    page.locator('g.details-scale > g > g:last-child > text').first(),
  ).toHaveText(new RegExp(`^${max}$`));
}

/**
 * Tests that the size header resizes when sets are added/removed and the advanced scale slider works
 */
test('Size header', async ({ page, browserName }) => {
  await page.goto(
    'http://localhost:3000/?workspace=Upset+Examples&table=simpsons&sessionId=193',
  );

  // Ensure that the scale increases when necessary upon set removal
  await assertSizeScaleMax(page, 3);
  await removeSetByName(page, 'Blue Hair');
  await assertSizeScaleMax(page, 5);

  // Ensure that the scale decreases when necessary upon set removal
  await removeSetByName(page, 'Male');
  await assertSizeScaleMax(page, 8);

  // Ensure that the scale updates upon set addition
  await addSetByName(page, 'Male');
  await assertSizeScaleMax(page, 5);

  // Ensure that dragging the advanced slider works
  await toggleAdvancedScale(page);
  // This legacy code is supposed to move the advanced scale slider but has been broken in Chromium by updates;
  // leaving it in case fixing becomes a priority
  if (browserName !== 'chromium')
    await page
      .locator('g.sliding-scale > g.slider-knob')
      .locator('rect')
      .dragTo(page.getByText('15'), { force: true });

  const correctMax = browserName === 'chromium' ? 5 : 15;
  await assertSizeScaleMax(page, correctMax);

  // Ensure that adding sets doesn't affect the advanced scale
  await addSetByName(page, 'Blue Hair');
  await assertSizeScaleMax(page, correctMax);

  // Ensure that scale recalculates correctly when advanced is turned off
  await toggleAdvancedScale(page);
  await assertSizeScaleMax(page, 3);
});

/**
 * Tests that the attribute header menu items for changing plot type work and update on selection
 * *Note* Does NOT test the actual plot rendering
 */
test('Attribute Plot Types', async ({ page }) => {
  await page.goto(
    'http://localhost:3000/?workspace=Upset+Examples&table=simpsons&sessionId=193',
  );

  // remove 'Male' set so that there are attributes with at least 6 items (threshold for dotplot)
  await removeSetByName(page, 'Male');

  const ageAttributeHeader = page.locator('#header-text-Age');

  await ageAttributeHeader.click({ button: 'right', force: true });

  // Click 'Change plot type to Dot Plot'
  await page.getByRole('menuitem', { name: 'Change plot type to Dot Plot' }).click();
  await ageAttributeHeader.click({ button: 'right', force: true });

  // Expect that dot plot is disabled
  await expect(
    page.getByRole('menuitem', { name: 'Change plot type to Dot Plot' }),
  ).toBeDisabled();

  // Click 'Change plot type to Strip Plot'
  await page.getByRole('menuitem', { name: 'Change plot type to Strip Plot' }).click();
  await ageAttributeHeader.click({ button: 'right', force: true });

  // Expect that strip plot is disabled
  await expect(
    page.getByRole('menuitem', { name: 'Change plot type to Strip Plot' }),
  ).toBeDisabled();

  // Click 'Change plot type to Density Plot'
  await page.getByRole('menuitem', { name: 'Change plot type to Density Plot' }).click();
  await ageAttributeHeader.click({ button: 'right', force: true });

  // Expect that density plot is disabled
  await expect(
    page.getByRole('menuitem', { name: 'Change plot type to Density Plot' }),
  ).toBeDisabled();
});
