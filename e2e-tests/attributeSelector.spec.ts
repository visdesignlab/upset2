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

test('Attribute Dropdown', async ({ page }) => {
  await page.goto('http://localhost:3000/?workspace=Upset+Examples&table=simpsons&sessionId=193');

  /// /////////////////
  // Age
  /// /////////////////
  // Deseslect and assert that it's removed from the plot
  await page.getByLabel('Open attributes selection menu').click();
  await page.getByRole('checkbox', { name: 'Age' }).uncheck();
  await page.locator('.MuiPopover-root > .MuiBackdrop-root').click();
  await expect(page.getByLabel('Age').locator('rect')).toHaveCount(0);

  // Reselect and assert that it's added back to the plot
  await page.getByLabel('Open attributes selection menu').click();
  await page.getByLabel('Age').check();
  await page.locator('.MuiPopover-root > .MuiBackdrop-root').click();
  await expect(page.getByLabel('Age').locator('rect')).toBeVisible();

  /// /////////////////
  // Degree
  /// /////////////////
  // Deselect and assert that it's removed from the plot
  await page.getByLabel('Open attributes selection menu').click();
  await page.getByRole('checkbox', { name: 'Degree' }).uncheck();
  await page.locator('.MuiPopover-root > .MuiBackdrop-root').click();
  await expect(page.locator('#upset-svg').getByLabel('Degree').locator('rect')).toHaveCount(0);

  // Reselect and assert that it's added back to the plot
  await page.getByLabel('Open attributes selection menu').click();
  await page.getByRole('checkbox', { name: 'Degree' }).check();
  await page.locator('.MuiPopover-root > .MuiBackdrop-root').click();
  await expect(page.locator('#upset-svg').getByLabel('Degree').locator('rect')).toBeVisible();

  /// /////////////////
  // Deviation
  /// /////////////////
  // Deselect and assert that it's removed from the plot
  await page.getByLabel('Open attributes selection menu').click();
  await page.getByRole('checkbox', { name: 'Deviation' }).uncheck();
  await page.locator('.MuiPopover-root > .MuiBackdrop-root').click();
  await expect(page.getByLabel('Deviation', { exact: true }).locator('rect')).toHaveCount(0);

  // Reselect and assert that it's added back to the plot
  await page.getByLabel('Open attributes selection menu').click();
  await page.getByRole('checkbox', { name: 'Deviation' }).check();
  await page.locator('.MuiPopover-root > .MuiBackdrop-root').click();
  await expect(page.getByLabel('Deviation', { exact: true }).locator('rect')).toBeVisible();
});
