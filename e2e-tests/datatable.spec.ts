import { test, expect } from '@playwright/test';
import { beforeTest } from './common';

test.beforeEach(beforeTest);

test('Datatable', async ({ page }) => {
  await page.goto('http://localhost:3000/?workspace=Upset+Examples&table=simpsons&sessionId=193');

  // //////////////////
  // Open the datatable
  // //////////////////
  await page.getByLabel('Additional options menu').click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByLabel('Data Tables (raw and computed)').click();

  // //////////////////
  // Test downloads
  // //////////////////
  const page1 = await page1Promise;
  await beforeTest({ page: page1 });
  const heading1 = await page1.getByRole('heading', { name: 'Intersection Data' });
  await expect(heading1).toBeVisible();

  // const downloadPromise = page1.waitForEvent('download');
  const downloadButton = await page1
    .locator('div')
    .filter({ hasText: /^Intersection DataDownload$/ })
    .getByRole('button');
  await expect(downloadButton).toBeVisible();
  await downloadButton.click();
  // const download = await downloadPromise;
  // await expect(download).not.toBeNull();

  const heading2 = await page1.getByRole('heading', { name: 'Visible Sets' });
  await expect(heading2).toBeVisible();
  const download2Promise = page1.waitForEvent('download');
  const downloadButton2 = await page1
    .locator('div')
    .filter({ hasText: /^Visible SetsDownload$/ })
    .getByRole('button');
  await expect(downloadButton2).toBeVisible();
  await downloadButton2.click();
  const download2 = await download2Promise;
  await expect(download2).not.toBeNull();

  // there is no download event because there are no hidden sets in this dataset
  const heading3 = await page1.getByRole('heading', { name: 'Hidden Sets' });
  await expect(heading3).toBeVisible();

  const downloadButton3 = await page1
    .locator('div')
    .filter({ hasText: /^Hidden SetsDownload$/ })
    .getByRole('button');
  await expect(downloadButton3).toBeVisible();

  // //////////////////
  // Test that the tables exist
  // //////////////////
  const datatable = await page1.getByRole('gridcell', { name: 'School & Male' });
  await expect(datatable).toBeVisible();
  const visibleSets = await page1.getByText('Set').nth(1);
  await expect(visibleSets).toBeVisible();
  const hiddenSets = await page1.getByText('No rows');
  await expect(hiddenSets).toBeVisible();
});
