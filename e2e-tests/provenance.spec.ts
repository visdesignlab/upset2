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

/**
 * Asserts that trrack history works for selecting and deselecting rows, provenance tree is displayed correctly, 
 * reverting to an earlier state works, and aggregate rows can be selected and deselected.
 */
test('Selection History', async ({ page }) => {
  await page.goto('http://localhost:3000/?workspace=Upset+Examples&table=simpsons&sessionId=193');

  await page.getByLabel('Open additional options menu').click();
  await page.getByLabel('Open history tree sidebar').click();
  await page.locator('circle').first().click();
  await page.locator('circle').first().click();
  await expect(page.locator('div').filter({ hasText: /^Select intersection "School & Male"$/ }).nth(2)).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Deselect intersection$/ }).nth(2)).toBeVisible();
  await page.getByRole('radio', { name: 'Degree' }).check();
  await page.locator('g').filter({ hasText: /^Degree 3Degree 3$/ }).locator('rect').click();
  await expect(page.locator('div').filter({ hasText: /^Select intersection "Degree 3"$/ }).nth(2)).toBeVisible();
  await page.locator('g').filter({ hasText: /^Degree 3Degree 3$/ }).locator('rect').click();
  await expect(page.getByText('Deselect intersection').nth(1)).toBeVisible();
  await page.locator('g:nth-child(4) > .css-1kek4un-Y > g:nth-child(4) > rect').click();
  await page.getByRole('radio', { name: 'None' }).check();
  await page.locator('.css-zf6412').click();
  await expect(page.getByText('Deselect intersection').nth(2)).toBeVisible();
  await page.locator('g:nth-child(10) > circle').click();
  await page.locator('.css-zf6412').click();
  await page.locator('g:nth-child(7) > .css-1kek4un-Y > g:nth-child(4) > rect').click();
  await expect(page.getByText('Deselect intersection')).toBeVisible();
  await expect(page.getByText('Select intersection "Duff Fan')).toBeVisible();
});
