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

test('Datatable', async ({ page }) => {
  await page.goto('http://localhost:3000/?workspace=Upset+Examples&table=simpsons&sessionId=193');

  // //////////////////
  // Open the datatable
  // //////////////////
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Data Table' }).click();

  // //////////////////
  // Test downloads
  // //////////////////
  const page1 = await page1Promise;
  const heading1 = await page1.getByRole('heading', { name: 'Intersection Data' });
  await expect(heading1).toBeVisible();

  const downloadPromise = page1.waitForEvent('download');
  const downloadButton = await page1.locator('div').filter({ hasText: /^Intersection DataDownload$/ }).getByRole('button');
  await expect(downloadButton).toBeVisible();
  await downloadButton.click();
  const download = await downloadPromise;
  await expect(download).not.toBeNull();

  const heading2 = await page1.getByRole('heading', { name: 'Visible Sets' });
  await expect(heading2).toBeVisible();
  const download2Promise = page1.waitForEvent('download');
  const downloadButton2 = await page1.locator('div').filter({ hasText: /^Visible SetsDownload$/ }).getByRole('button');
  await expect(downloadButton2).toBeVisible();
  await downloadButton2.click();
  const download2 = await download2Promise;
  await expect(download2).not.toBeNull();

  // there is no download event because there are no hidden sets in this dataset
  const heading3 = await page1.getByRole('heading', { name: 'Hidden Sets' });
  await expect(heading3).toBeVisible();

  const downloadButton3 = await page1.locator('div').filter({ hasText: /^Hidden SetsDownload$/ }).getByRole('button');
  await expect(downloadButton3).toBeVisible();

  // //////////////////
  // Test that the tables exist
  // //////////////////
  const datatable = await page1.getByText('IntersectionSizeDeviationAgeSchool & Male35.199.33Unincluded35.1930.33Male3-9.4257.33Duff Fan & Male & Power Plant310.5838.33Evil & Male21.0343.50Evil & Male & Power Plant26.4161.50Duff Fan & Male21.0340.00Blue Hair27.2956.00School11.738.00School & Evil & Male11.7311.00Rows per page:101–10 of');
  await expect(datatable).toBeVisible();
  const visibleSets = await page1.getByText('SetSizeSchool6Blue Hair3Duff Fan6Evil6Male18Power Plant5Rows per page:101–6 of');
  await expect(visibleSets).toBeVisible();
  const hiddenSets = await page1.getByText('No rowsSetSizeRows per page:100–0 of');
  await expect(hiddenSets).toBeVisible();
});
