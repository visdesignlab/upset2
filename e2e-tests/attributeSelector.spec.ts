import { test, expect } from '@playwright/test';
import { beforeTest } from './common';

test.beforeEach(beforeTest);

test('Attribute Dropdown', async ({ page }) => {
  await page.goto('http://localhost:3000/?workspace=Upset+Examples&table=simpsons&sessionId=193');

  /// /////////////////
  // Age
  /// /////////////////
  // Deseslect and assert that it's removed from the plot
  await page.getByLabel('Attributes selection menu').click();
  await page.getByRole('checkbox', { name: 'Age' }).uncheck();
  await page.locator('.MuiPopover-root > .MuiBackdrop-root').click();
  await expect(page.getByLabel('Age').locator('rect')).toHaveCount(0);

  // Reselect and assert that it's added back to the plot
  await page.getByLabel('Attributes selection menu').click();
  await page.getByLabel('Age').check();
  await page.locator('.MuiPopover-root > .MuiBackdrop-root').click();
  await expect(page.getByLabel('Age').locator('rect')).toBeVisible();

  /// /////////////////
  // Degree
  /// /////////////////
  // Deselect and assert that it's removed from the plot
  await page.getByLabel('Attributes selection menu').click();
  await page.getByRole('checkbox', { name: 'Degree' }).uncheck();
  await page.locator('.MuiPopover-root > .MuiBackdrop-root').click();
  await expect(page.locator('#upset-svg').getByLabel('Degree').locator('rect')).toHaveCount(0);

  // Reselect and assert that it's added back to the plot
  await page.getByLabel('Attributes selection menu').click();
  await page.getByRole('checkbox', { name: 'Degree' }).check();
  await page.locator('.MuiPopover-root > .MuiBackdrop-root').click();
  await expect(page.locator('#upset-svg').getByLabel('Degree').locator('rect')).toBeVisible();

  /// /////////////////
  // Deviation
  /// /////////////////
  // Deselect and assert that it's removed from the plot
  await page.getByLabel('Attributes selection menu').click();
  await page.getByRole('checkbox', { name: 'Deviation' }).uncheck();
  await page.locator('.MuiPopover-root > .MuiBackdrop-root').click();
  await expect(page.getByLabel('Deviation', { exact: true }).locator('rect')).toHaveCount(0);

  // Reselect and assert that it's added back to the plot
  await page.getByLabel('Attributes selection menu').click();
  await page.getByRole('checkbox', { name: 'Deviation' }).check();
  await page.locator('.MuiPopover-root > .MuiBackdrop-root').click();
  await expect(page.getByLabel('Deviation', { exact: true }).locator('rect')).toBeVisible();
});
