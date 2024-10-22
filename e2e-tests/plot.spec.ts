import { test, expect } from '@playwright/test';
import { beforeTest } from './common';

test.beforeEach(beforeTest);

/**
 * Toggles the advanced scale slider. Must be awaited
 * @param page page provided to test function
 */
async function toggleAdvancedScale(page) {
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
async function removeSetByName(page, setName: string) {
  await page.locator('p').filter({ hasText: new RegExp(`^${setName}$`) }).click({ button: 'right' });
  await page.getByRole('menuitem', { name: `Remove Set: ${setName}` }).click();
}

/**
 * Adds an invisible set by name. Must be awaited
 * @param page page provided to test
 * @param setName name of set
 */
async function addSetByName(page, setName: string) {
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
async function assertSizeScaleMax(page, max: number) {
  await expect(page.locator('g.details-scale > g > g:last-child > text').nth(1))
    .toHaveText(new RegExp(`^${max}$`));
}

/**
 * Tests that the size header resizes when sets are added/removed and the advanced scale slider works
 */
test('Size header', async ({ page }) => {
  await page.goto('http://localhost:3000/?workspace=Upset+Examples&table=simpsons&sessionId=193');

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
  await page.locator('g').filter({ hasText: /^0055101015152020Size001122334455$/ }).locator('rect').nth(1)
    .dragTo(page.getByText('15', { exact: true }).nth(1), { force: true });
  await assertSizeScaleMax(page, 15);

  // Ensure that adding sets doesn't affect the advanced scale
  await addSetByName(page, 'Blue Hair');
  await assertSizeScaleMax(page, 15);

  // Ensure that scale recalculates correctly when advanced is turned off
  await toggleAdvancedScale(page);
  await assertSizeScaleMax(page, 3);
});

/**
 * Tests that the attribute header menu items for changing plot type work and update on selection
 * *Note* Does NOT test the actual plot rendering
 */
test('Attribute Plot Types', async ({ page }) => {
  await page.goto('http://localhost:3000/?workspace=Upset+Examples&table=simpsons&sessionId=193');

  // remove 'Male' set so that there are attributes with at least 6 items (threshold for dotplot)
  await removeSetByName(page, 'Male');

  const ageAttributeHeader = page.getByLabel('Age').locator('rect');

  await ageAttributeHeader.click({ button: 'right', force: true });

  // Click 'Change plot type to Dot Plot'
  await page.getByRole('menuitem', { name: 'Change plot type to Dot Plot' }).click();
  await ageAttributeHeader.click({ button: 'right', force: true });

  // Expect that dot plot is disabled
  await expect(page.getByRole('menuitem', { name: 'Change plot type to Dot Plot' })).toBeDisabled();

  // Click 'Change plot type to Strip Plot'
  await page.getByRole('menuitem', { name: 'Change plot type to Strip Plot' }).click();
  await ageAttributeHeader.click({ button: 'right', force: true });

  // Expect that strip plot is disabled
  await expect(page.getByRole('menuitem', { name: 'Change plot type to Strip Plot' })).toBeDisabled();

  // Click 'Change plot type to Density Plot'
  await page.getByRole('menuitem', { name: 'Change plot type to Density Plot' }).click();
  await ageAttributeHeader.click({ button: 'right', force: true });

  // Expect that density plot is disabled
  await expect(page.getByRole('menuitem', { name: 'Change plot type to Density Plot' })).toBeDisabled();
});
