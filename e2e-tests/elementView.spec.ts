import {
  test, expect, Page, Locator,
} from '@playwright/test';
import { beforeTest } from './common';

test.beforeEach(beforeTest);

/**
 * Drags the mouse from the center of the element to the specified offset.
 * Doesn't quite work in firefox; use caution
 * @see https://stackoverflow.com/a/71147367
 * @param element The element to drag over
 * @param xOffset The x offset to drag to
 * @param yOffset The y offset to drag to
 * @param page The page to perform the drag on
 */
async function dragElement(element: Locator, xOffset: number, yOffset: number, page: Page): Promise<void> {
  const elementBox = await element.boundingBox();
  if (!elementBox) {
    throw new Error('Unable to find bounding box on element');
  }

  const elementCenterX = elementBox.x + elementBox.width / 2;
  const elementCenterY = elementBox.y + elementBox.height / 2;

  await element.hover();
  await page.mouse.down();
  await page.mouse.move(elementCenterX + xOffset, elementCenterY + yOffset);
  await page.mouse.up();
}

test('Element View', async ({ page, browserName }) => {
  await page.goto('http://localhost:3000/?workspace=Upset+Examples&table=simpsons&sessionId=193');

  // Open element view
  const elementViewToggle = await page.getByLabel('Element View Sidebar Toggle');
  await elementViewToggle.click();

  // Make sure the query table has results by default
  const lisaCell = page.getByRole('cell', { name: 'Lisa' });
  const cell8 = page.getByRole('cell', { name: '8', exact: true });
  await expect(cell8).toBeVisible();
  await expect(lisaCell).toBeVisible();

  // Make a selection on the vis of all data
  await dragElement(page.locator('canvas'), 20, 0, page);
  await expect(page.locator('#Subset_Male polygon').nth(1)).toBeVisible();
  await expect(page.getByLabel('Selected elements Atts: Age')).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Homer' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '40' })).toBeVisible();
  await expect(lisaCell).not.toBeVisible();
  await expect(cell8).not.toBeVisible();

  // Deselect
  await page.locator('canvas').click();

  // Make selection
  const row = await page.locator('g > circle').first(); // row
  await row.dispatchEvent('click');

  // test expansion buttons
  await page.getByRole('button', { name: 'Expand the sidebar in full' }).click();
  await page.getByLabel('Reduce the sidebar to normal').click();

  // Ensure all headings are visible
  const elementViewHeading = await page.getByRole('heading', { name: 'Element View' });
  await expect(elementViewHeading).toBeVisible();
  const elementQueriesHeading = await page.getByRole('heading', { name: 'Element Queries' });
  await expect(elementQueriesHeading).toBeVisible();
  const elementVisualizationHeading = await page.getByRole('heading', { name: 'Element Visualization' });
  await expect(elementVisualizationHeading).toBeVisible();
  const queryResultHeading = await page.getByRole('heading', { name: 'Query Result' });
  await expect(queryResultHeading).toBeVisible();

  // Check to see that the selection chip is visible
  const selectionChip = await page.getByLabel('Selected intersection School');
  await expect(selectionChip).toBeVisible();

  // Check that the datatable is visible and populated
  const dataTable = page.getByText(
    'LabelDegreeDeviationAgeSchoolBlue HairDuff FanEvilBart10yesnononoRalph8yesnononoMartin Prince10yesnononoRows per page:1001–3 of',
  );
  dataTable.scrollIntoViewIfNeeded();
  await expect(dataTable).toBeVisible();
  const nameCell = await page.getByRole('cell', { name: 'Bart' });
  await expect(nameCell).toBeVisible();
  const ageCell = await page.getByRole('cell', { name: '10' }).first();
  await expect(ageCell).toBeVisible();

  // Check that the add plot button is visible
  const addPlot = await page.getByRole('button', { name: 'Add Plot' });
  await expect(addPlot).toBeVisible();
  await addPlot.click();

  // Check that plot options and plot preview are visible
  const histogramHeader = await page.getByRole('tab', { name: 'Histogram' });
  await expect(histogramHeader).toBeVisible();
  await histogramHeader.click();

  const vis = await page.getByLabel('Add Plot').locator('canvas');
  await expect(vis).toBeVisible();

  const option1 = await page.locator('div').filter({ hasText: /^AttributeAgeAttribute$/ }).first();
  await expect(option1).toBeVisible();

  const option2 = page.locator('div').filter({ hasText: /^BinsBins$/ }).first();
  await expect(option2).toBeVisible();

  const option3 = await page.locator('label').filter({ hasText: 'Frequency' });
  await expect(option3).toBeVisible();

  // close the plot preview
  const closeButton = await page.getByRole('heading', { name: 'Add Plot' }).getByRole('button');
  await expect(closeButton).toBeVisible();
  await closeButton.click();

  // Check that the download button is visible and works
  const downloadPromise = page.waitForEvent('download');
  const downloadButton = await page.getByLabel('Download 3 elements');
  await expect(downloadButton).toBeVisible();
  await downloadButton.click();
  await downloadPromise;

  // Check that the close button is visible and works
  const elementViewClose = await page.getByRole('button', { name: 'Close the sidebar' });
  await expect(elementViewClose).toBeVisible();
  await elementViewClose.click();

  /*
   * Tests for selection behavior
   */

  // Check that the selection chip is visible after selecting
  await elementViewToggle.click();

  // I cannot, for the life of me, get Firefox to properly drag the selection. The mouseup doesn't fire, so the
  // selection doesn't get saved, EVEN THOUGH this works perfectly nicely fine up at the top of this test and
  // in chromium/webkit. I'm going to skip this test in Firefox for now.
  if (browserName !== 'firefox') {
    // 120 is exactly enough to select through Age 10 but not drag off the canvas, which doesn't fire the click event
    await dragElement(page.locator('canvas'), 120, 0, page);

    const elementSelectionChip = await page.getByLabel('Selected elements Atts: Age');
    await expect(elementSelectionChip).toBeVisible();

    // Check that the selection is visible in the size bars
    const schoolMale1stPoly = await page.locator('[id="Subset_School\\~\\&\\~Male"] polygon').first();
    await expect(schoolMale1stPoly).toBeVisible();

    const schoolMale3rdPoly = await page.locator('[id="Subset_School\\~\\&\\~Male"] polygon').nth(3);
    await expect(schoolMale3rdPoly).toBeVisible();

    const schoolBlueHairMale1stPoly =
    await page.locator('[id="Subset_School\\~\\&\\~Blue_Hair\\~\\&\\~Male"] polygon').first();
    await expect(schoolBlueHairMale1stPoly).toBeVisible();

    const schoolMaleSelectionRect =
    await page.locator('[id="Subset_School\\~\\&\\~Male"] g').filter({ hasText: '3' }).locator('rect').nth(1);
    await expect(schoolMaleSelectionRect).toBeVisible();

    const schoolBlueHairMaleSelectionRect =
    await page.locator('[id="Subset_School\\~\\&\\~Blue_Hair\\~\\&\\~Male"] g')
      .filter({ hasText: '1' }).locator('rect').nth(1);
    await expect(schoolBlueHairMaleSelectionRect).toBeVisible();

    // Check that bookmarking works
    await page.getByLabel('Selected elements Atts: Age').locator('svg.MuiChip-deleteIcon').click();
    await expect(elementSelectionChip).not.toBeVisible();

    // Check that deselecting a bookmarked selection works
    const elementSelectionBookmark = await page.getByLabel('Atts: Age');
    await elementSelectionBookmark.click();
    await expect(schoolMale1stPoly).toBeVisible();
    await expect(schoolBlueHairMale1stPoly).not.toBeVisible();
    await expect(schoolMaleSelectionRect).not.toBeVisible();
    await expect(schoolBlueHairMaleSelectionRect).not.toBeVisible();
    await expect(schoolMale3rdPoly).not.toBeVisible();

    // Check that reselecting a bookmarked selection works
    await elementSelectionBookmark.click();
    await expect(schoolBlueHairMale1stPoly).toBeVisible();
    await expect(schoolMaleSelectionRect).toBeVisible();
    await expect(schoolBlueHairMaleSelectionRect).toBeVisible();
    await expect(schoolMale3rdPoly).toBeVisible();
  }

  /*
    * Plot removal
    */
  await page.locator('div').filter({ hasText: /^Add Plot$/ }).getByRole('button').nth(1)
    .click();
  await expect(page.locator('canvas')).not.toBeVisible();
});

/**
 * Clears the selection in the element view; element view must be open
 * @param page The page to perform the clear selection on
 */
async function clearSelection(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Clear' }).click();
}

/**
 * Sets a query in the element view; element view must be open
 * @param page The current testing page
 * @param att The attribute to query
 * @param type The type of query
 * @param query The query string
 */
async function setQuery(page: Page, att: string, type: string, query: string): Promise<void> {
  await page.getByLabel('Attribute Name').click();
  await page.getByRole('option', { name: att }).click();
  await page.getByLabel('Query Type').click();
  await page.getByRole('option', { name: type, exact: true }).click();
  await page.getByPlaceholder('Query').click();
  await page.getByPlaceholder('Query').fill(query);
  await page.getByRole('button', { name: 'Apply' }).click();
}

test('Query Selection', async ({ page }) => {
  await page.goto('http://localhost:3000/?workspace=Upset+Examples&table=simpsons&sessionId=193');
  await page.getByLabel('Element View Sidebar Toggle').click();
  await page.locator('[id="Subset_School\\~\\&\\~Male"] g').filter({ hasText: /^Blue Hair$/ }).locator('circle').click();

  // Selected elements for testing
  const ralphCell = page.getByRole('cell', { name: 'Ralph' });
  const age8Cell = page.getByRole('cell', { name: '8' });
  const bartCell = page.getByRole('cell', { name: 'Bart' });
  const age10Cell1 = page.getByRole('cell', { name: '10' }).first();
  const age10Cell2 = page.getByRole('cell', { name: '10' }).nth(1);
  const martinCell = page.getByRole('cell', { name: 'Martin Prince' });
  const schoolSelectPoly = page.locator('#Subset_School polygon').nth(1);
  const maleSelectPoly = page.locator('#Subset_Male polygon').nth(1);
  const schoolMaleSelectPoly = page.locator('[id="Subset_School\\~\\&\\~Male"] polygon').nth(1);

  // Test less than query
  await setQuery(page, 'Age', 'less than', '10');

  await expect(schoolMaleSelectPoly).toBeVisible();
  await expect(ralphCell).toBeVisible();
  await expect(age8Cell).toBeVisible();
  await expect(bartCell).not.toBeVisible();
  await expect(age10Cell1).not.toBeVisible();
  await expect(age10Cell2).not.toBeVisible();
  await expect(martinCell).not.toBeVisible();
  await expect(schoolSelectPoly).toBeVisible();
  await expect(maleSelectPoly).not.toBeVisible();

  // Test greater than query
  await clearSelection(page);
  await setQuery(page, 'Age', 'greater than', '8');

  await expect(bartCell).toBeVisible();
  await expect(age10Cell1).toBeVisible();
  await expect(age10Cell2).toBeVisible();
  await expect(martinCell).toBeVisible();
  await expect(maleSelectPoly).toBeVisible();
  await expect(schoolMaleSelectPoly).toBeVisible();
  await expect(ralphCell).not.toBeVisible();
  await expect(age8Cell).not.toBeVisible();
  await expect(schoolSelectPoly).not.toBeVisible();

  // Test contains query
  await clearSelection(page);
  await setQuery(page, 'Name', 'contains', 't');

  await expect(bartCell).toBeVisible();
  await expect(age10Cell1).toBeVisible();
  await expect(age10Cell2).toBeVisible();
  await expect(martinCell).toBeVisible();
  await expect(maleSelectPoly).toBeVisible();
  await expect(schoolMaleSelectPoly).toBeVisible();
  await expect(ralphCell).not.toBeVisible();
  await expect(age8Cell).not.toBeVisible();
  await expect(schoolSelectPoly).not.toBeVisible();

  // Test equals query
  await clearSelection(page);
  await setQuery(page, 'Name', 'equals', 'Bart');

  await expect(bartCell).toBeVisible();
  await expect(age10Cell1).toBeVisible();
  await expect(schoolMaleSelectPoly).toBeVisible();
  await expect(age10Cell2).not.toBeVisible();
  await expect(martinCell).not.toBeVisible();
  await expect(maleSelectPoly).not.toBeVisible();
  await expect(ralphCell).not.toBeVisible();
  await expect(age8Cell).not.toBeVisible();
  await expect(schoolSelectPoly).not.toBeVisible();

  // Test length equals query
  await clearSelection(page);
  await setQuery(page, 'Name', 'length equals', '5');

  await expect(ralphCell).toBeVisible();
  await expect(age8Cell).toBeVisible();
  await expect(schoolMaleSelectPoly).toBeVisible();
  await expect(bartCell).not.toBeVisible();
  await expect(age10Cell1).not.toBeVisible();
  await expect(age10Cell2).not.toBeVisible();
  await expect(martinCell).not.toBeVisible();
  await expect(schoolSelectPoly).not.toBeVisible();
  await expect(maleSelectPoly).not.toBeVisible();

  // Test regex query
  await clearSelection(page);
  await setQuery(page, 'Name', 'regex', '^([A-z]+)$');

  await expect(page.locator('[id="Subset_Evil\\~\\&\\~Male"] polygon').nth(1)).not.toBeVisible();
  await expect(bartCell).toBeVisible();
  await expect(age10Cell1).toBeVisible();
  await expect(ralphCell).toBeVisible();
  await expect(age8Cell).toBeVisible();
  await expect(martinCell).not.toBeVisible();
  await expect(age10Cell2).not.toBeVisible();
  await expect(schoolMaleSelectPoly).toBeVisible();
  await expect(schoolSelectPoly).toBeVisible();
  await expect(maleSelectPoly).toBeVisible();

  // Test clear selection
  await clearSelection(page);
  await expect(bartCell).toBeVisible();
  await expect(age10Cell1).toBeVisible();
  await expect(ralphCell).toBeVisible();
  await expect(age8Cell).toBeVisible();
  await expect(martinCell).toBeVisible();
  await expect(age10Cell2).toBeVisible();
  // Only visible because the intersection is selected
  await expect(schoolMaleSelectPoly).toBeVisible();
  await expect(schoolSelectPoly).not.toBeVisible();
  await expect(maleSelectPoly).not.toBeVisible();
});
