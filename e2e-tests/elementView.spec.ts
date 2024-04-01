/* eslint-disable testing-library/prefer-screen-queries */
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
  await page.getByLabel('Open element view sidebar').click();

  await page.getByLabel('Expand the sidebar in full').click();
  await page.getByLabel('Reduce the sidebar to normal').click();

  const row = await page.locator('circle').first(); // row
  await expect(row).toBeVisible();
  await row.click();

  const elementViewHeading = await page.getByRole('heading', { name: 'Element View' });
  await expect(elementViewHeading).toBeVisible();
  const elementQueriesHeading = await page.getByRole('heading', { name: 'Element Queries' });
  await expect(elementQueriesHeading).toBeVisible();
  const elementVisualizationHeading = await page.getByRole('heading', { name: 'Element Visualization' });
  await expect(elementVisualizationHeading).toBeVisible();
  const queryResultHeading = await page.getByRole('heading', { name: 'Query Result' });
  await expect(queryResultHeading).toBeVisible();

  const selectionChip = await page.getByLabel('Selected intersection School');
  await expect(selectionChip).toBeVisible();

  const dataTable = await page.locator('div').filter({ hasText: /^simpsons\/40726826Bart10simpsons\/40726838Ralph8simpsons\/40726848Martin Prince10$/ }).nth(2);
  await expect(dataTable).toBeVisible();

  const cell1 = await page.getByRole('cell', { name: 'simpsons/40726826' });
  await expect(cell1).toBeVisible();

  const cell2 = await page.getByRole('cell', { name: 'Bart' });
  await expect(cell2).toBeVisible();

  const cell3 = await page.getByRole('cell', { name: '10' }).first();
  await expect(cell3).toBeVisible();

  const addPlot = await page.getByRole('button', { name: 'Add Plot' });
  await expect(addPlot).toBeVisible();
  await addPlot.click();

  const histogramHeader = await page.getByRole('tab', { name: 'Histogram' });
  await expect(histogramHeader).toBeVisible();
  await histogramHeader.click();

  const vis = await page.locator('canvas');
  await expect(vis).toBeVisible();

  const option1 = await page.locator('div').filter({ hasText: /^AttributeAgeAttribute$/ }).first();
  await expect(option1).toBeVisible();

  const option2 = page.locator('div').filter({ hasText: /^BinsBins$/ }).first();
  await expect(option2).toBeVisible();

  const option3 = await page.locator('label').filter({ hasText: 'Frequency' });
  await expect(option3).toBeVisible();

  const closeButton = await page.getByRole('heading', { name: 'Add Plot' }).getByRole('button');
  await expect(closeButton).toBeVisible();
  await closeButton.click();

  const downloadPromise = page.waitForEvent('download');
  const downloadButton = await page.getByLabel('Download 3 elements');
  await expect(downloadButton).toBeVisible();
  await downloadButton.click();
  const download = await downloadPromise;

  const elementViewClose = await page.getByLabel('Close the sidebar');
  await expect(elementViewClose).toBeVisible();
  await elementViewClose.click();
});
