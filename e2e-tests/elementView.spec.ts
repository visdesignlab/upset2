import { test, expect } from '@playwright/test';
import mockData from '../playwright/mock-data/simpsons/simpsons_data.json';
import mockAnnotations from '../playwright/mock-data/simpsons/simpsons_annotations.json';
import mockAltText from '../playwright/mock-data/simpsons/simpsons_alttxt.json';

test.beforeEach(async ({ page }) => {
  await page.route('*/**/api/**', async (route) => {
    const url = route.request().url();
    let json;

    if (url) {
      if (url.includes('workspaces/Upset%20Examples/tables/simpsons/rows/?limit=9007199254740991')) {
        json = mockData;
        await route.fulfill({ json });
      } else if (url.includes('workspaces/Upset%20Examples/tables/simpsons/annotations/')) {
        json = mockAnnotations;
        await route.fulfill({ json });
      } else if (url.includes('alttxt')) {
        json = mockAltText;
        await route.fulfill({ json });
      } else if (url.includes('workspaces/Upset%20Examples/sessions/table/193/state/')) {
        await route.fulfill({ status: 200 });
      } else {
        await route.continue();
      }
    } else {
      await route.abort();
    }
  });
});

test('Element View', async ({ page }) => {
  await page.goto('http://localhost:3000/?workspace=Upset+Examples&table=simpsons&sessionId=193');

  // Make selection
  const row = await page.locator('g > circle').first(); // row
  await row.dispatchEvent('click');

  // Open element view
  await page.getByLabel('Element View Sidebar Toggle').click();

  // test expansion buttons
  await page.getByLabel('Expand the sidebar in full').click();
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
  const dataTable = await page.locator('div').filter({ hasText: /^simpsons\/40726826Bart10simpsons\/40726838Ralph8simpsons\/40726848Martin Prince10$/ }).nth(2);
  await expect(dataTable).toBeVisible();
  const cell1 = await page.getByRole('cell', { name: 'simpsons/40726826' });
  await expect(cell1).toBeVisible();
  const cell2 = await page.getByRole('cell', { name: 'Bart' });
  await expect(cell2).toBeVisible();
  const cell3 = await page.getByRole('cell', { name: '10' }).first();
  await expect(cell3).toBeVisible();

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

  // These should be uncommented when density (frequency) plots are re-added
  // const option3 = await page.locator('label').filter({ hasText: 'Frequency' });
  // await expect(option3).toBeVisible();

  // close the plot preview
  const closeButton = await page.getByRole('heading', { name: 'Add Plot' }).getByRole('button');
  await expect(closeButton).toBeVisible();
  await closeButton.click();

  // Check that the download button is visible and works
  const downloadPromise = page.waitForEvent('download');
  const downloadButton = await page.getByLabel('Download 3 elements');
  await expect(downloadButton).toBeVisible();
  await downloadButton.click();
  const download = await downloadPromise;

  // Check that the close button is visible and works
  const elementViewClose = await page.getByLabel('Close the sidebar');
  await expect(elementViewClose).toBeVisible();
  await elementViewClose.click();
});
