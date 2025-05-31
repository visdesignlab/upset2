import { test, expect } from '@playwright/test';
import { beforeTest } from './common';

test.beforeEach(beforeTest);

/**
 * Selects or deselects an attribute from the attribute dropdown
 * @param page the page to interact with
 * @param attributeName the name of the attribute to toggle
 * @param checked whether to select or deselect the attribute
 */
async function toggleAttribute(page, attributeName, checked) {
  await page.getByLabel('Attributes').first().click();
  await page.getByRole('option', { name: attributeName }).getByRole('checkbox').setChecked(checked);
  await page.locator('#menu- > .MuiBackdrop-root').click();
}

test('Attribute Dropdown', async ({ page }) => {
  await page.goto('http://localhost:3000/?workspace=Upset+Examples&table=simpsons&sessionId=193');

  /// /////////////////
  // Age
  /// /////////////////
  // Deseslect and assert that it's removed from the plot
  await toggleAttribute(page, 'Age', false);
  await expect(page.getByLabel('Age').locator('rect')).toHaveCount(0);

  // Reselect and assert that it's added back to the plot
  await toggleAttribute(page, 'Age', true);
  // This doesn't make sense but it works to find the Age column header
  await expect(
    page
      .locator('g')
      .filter({ hasText: /^Age20406080$/ })
      .locator('rect'),
  ).toBeVisible();

  /// /////////////////
  // Degree
  /// /////////////////
  // Deselect and assert that it's removed from the plot
  await toggleAttribute(page, 'Degree', false);
  await expect(page.locator('#upset-svg').getByLabel('Number of intersecting sets').locator('rect')).toHaveCount(0);

  // Reselect and assert that it's added back to the plot
  await toggleAttribute(page, 'Degree', true);
  await expect(page.locator('#upset-svg').getByLabel('Number of intersecting sets').locator('rect')).toBeVisible();

  /// /////////////////
  // Deviation
  /// /////////////////
  // Deselect and assert that it's removed from the plot
  await toggleAttribute(page, 'Deviation', false);
  await expect(page.getByLabel('Deviation', { exact: true }).locator('rect')).toHaveCount(0);

  // Reselect and assert that it's added back to the plot
  await toggleAttribute(page, 'Deviation', true);
  await expect(page.getByText('Deviation', { exact: true })).toBeDefined();

  // Check that categorical attributes exist
  await toggleAttribute(page, 'Generation', true);
  await expect(page.getByText('Generation', { exact: true })).toBeDefined();
  // Check for stacked bars
  await expect(page.getByLabel('Child — 3')).toBeDefined();
  await expect(page.locator('#Subset_Unincluded').getByLabel('Adult —')).toBeDefined();
  await expect(page.locator('#Subset_Male').getByLabel('Elder —')).toBeDefined();
  await expect(page.locator('#Subset_School').getByLabel('Child —')).toBeDefined();
  await expect(page.locator('#Subset_Blue_Hair').getByLabel('Elder —')).toBeDefined();
});
