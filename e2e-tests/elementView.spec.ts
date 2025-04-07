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
  await expect(lisaCell).toBeDefined();

  // Make a selection on the vis of all data
  await dragElement(page.locator('canvas'), 40, 0, page);
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

  // Check to see that the selection chip is visible
  await expect(page.getByRole('button', { name: 'Selected intersection School' })).toBeVisible();

  // Check that the datatable is visible and populated
  const dataTable = page.getByRole('grid');
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

  await expect(page.getByRole('tab', { name: 'KDE' })).toBeVisible();

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

  /** Element table tests; checking correct number of rows */
  // Re-used element table counts
  const count3 = page.getByText('1–3 of');
  const count24 = page.getByText('–24 of 24');

  // No selection
  await expect(count3).toBeVisible();

  // Bookmark 2 rows
  await page.locator('[id="Subset_School\\~\\&\\~Male"] > g:nth-child(3) > rect').click();
  await page.locator('#Subset_Unincluded > g:nth-child(3) > rect').click();
  await expect(count3).toBeVisible();

  // Start adding a query, recheck
  await page.getByTestId('AddIcon').locator('path').click();
  await expect(count3).toBeVisible();

  // Add a query
  await page.locator('g:nth-child(2) > g > circle:nth-child(7)').click();
  await page.locator('g:nth-child(4) > g > circle:nth-child(6)').click();
  await page.getByLabel('Add Query').locator('rect').click();
  await expect(page.getByText('1–5 of')).toBeVisible();

  // Remove query
  await page.getByLabel('Remove query').locator('rect').click();
  await expect(count24).toBeVisible();

  // Deselect bookmarked rows
  await page.locator('[id="Subset_School\\~\\&\\~Male"] path').click();
  await expect(count24).toBeVisible();
  await page.locator('#Subset_Unincluded path').click();
  await expect(count24).toBeVisible();

  /*
    * Plot removal
    */
  await page.locator('canvas').click({
    button: 'right',
    position: {
      x: 100,
      y: 113,
    },
  });
  await page.getByRole('menuitem', { name: 'Remove Plot' }).click();
  await expect(page.locator('canvas')).not.toBeVisible();
});

/**
 * Clears the selection in the element view; element view must be open
 * @param page The page to perform the clear selection on
 */
async function clearSelection(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Show explicit element query' }).click();
  await page.getByRole('button', { name: 'Clear' }).click();
  await page.getByRole('button', { name: 'Hide explicit element query' }).click();
}

/**
 * Sets a query in the element view; element view must be open
 * @param page The current testing page
 * @param att The attribute to query
 * @param type The type of query
 * @param query The query string
 */
async function setQuery(page: Page, att: string, type: string, query: string): Promise<void> {
  await page.getByRole('button', { name: 'Show explicit element query' }).click();
  await page.getByLabel('Attribute Name').click();
  await page.getByRole('option', { name: att }).click();
  await page.getByLabel('Query Type').click();
  await page.getByRole('option', { name: type, exact: true }).click();
  await page.getByPlaceholder('Query').click();
  await page.getByPlaceholder('Query').fill(query);
  await page.getByRole('button', { name: 'Apply' }).click();
  await page.getByRole('button', { name: 'Hide explicit element query' }).click();
}

// toBeDefined is used in place of toBeVisible in places where the cell is not in the visible
// portion of the table, as playwright has issues scrolling the table
test('Query Selection', async ({ page }) => {
  await page.goto('http://localhost:3000/?workspace=Upset+Examples&table=simpsons&sessionId=193');
  await page.getByLabel('Element View Sidebar Toggle').click();
  await page.locator('[id="Subset_School\\~\\&\\~Male"]').getByLabel('Blue Hair').locator('circle').click();

  // Selected elements for testing
  const ralphCell = page.getByRole('cell', { name: 'Ralph' });
  const age8Cell = page.getByRole('cell', { name: '8', exact: true }).first();
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
  await expect(martinCell).toBeDefined();
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
  await expect(ralphCell).toBeDefined();
  await expect(age8Cell).toBeVisible();
  await expect(martinCell).not.toBeVisible();
  await expect(age10Cell2).toBeDefined();
  await expect(schoolMaleSelectPoly).toBeVisible();
  await expect(schoolSelectPoly).toBeVisible();
  await expect(maleSelectPoly).toBeVisible();

  // Test clear selection
  await clearSelection(page);
  await expect(bartCell).toBeDefined();
  await expect(age10Cell1).toBeVisible();
  await expect(ralphCell).toBeDefined();
  await expect(age8Cell).toBeVisible();
  await expect(martinCell).toBeDefined();
  await expect(age10Cell2).toBeVisible();
  // Only visible because the intersection is selected
  await expect(schoolMaleSelectPoly).toBeVisible();
  await expect(schoolSelectPoly).not.toBeVisible();
  await expect(maleSelectPoly).not.toBeVisible();
});
