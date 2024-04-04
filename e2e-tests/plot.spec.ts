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
 * Toggles the advanced scale slider. Must be awaited
 * @param page page provided to test function
 */
async function toggleAdvancedScale(page) {
  await page.getByText('Size', { exact: true }).click({
    button: 'right',
    force: true,
  });
  await page.getByRole('menuitem', { name: 'Toggle Advanced Scale' }).click();
}

/**
 * Removes a visible set by name. Must be awaited
 * @param page page provided to test
 * @param setName name of set
 */
async function removeSetByName(page, setName: string) {
  await page.locator('p').filter({ hasText: new RegExp('^' + setName + '$') }).click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Remove Set: ' + setName }).click();
}

/**
 * Adds an invisible set by name. Must be awaited
 * @param page page provided to test
 * @param setName name of set
 */
async function addSetByName(page, setName: string) {
  await page.getByText(setName, { exact: true }).click({
    button: 'right'
  });
  await page.getByRole('menuitem', { name: 'Add Set: ' + setName }).click();
}

/**
 * Tests that the size header resizes when sets are added/removed and the advanced scale slider works
 */
test('Size header', async ({ page }) => {
  await page.goto('http://localhost:3000/?workspace=Upset+Examples&table=simpsons&sessionId=193');

  // Ensure that the scale increases when necessary upon set removal
  await expect(page.locator('g').filter({ hasText: /^33$/ }).locator('text').nth(1)).toBeVisible();
  await removeSetByName(page, 'Blue Hair');
  await expect(page.getByText('5', { exact: true }).nth(1)).toBeVisible();

  // Ensure that the scale decreases when necessary upon set removal
  await removeSetByName(page, 'Male');
  await expect(page.getByText('8', { exact: true }).nth(1)).toBeVisible();
  
  // Ensure that the scale updates upon set addition
  await addSetByName(page, 'Male');
  await expect(page.getByText('5', { exact: true }).nth(1)).toBeVisible();

  // Ensure that dragging the advanced slider works
  await toggleAdvancedScale(page);
  await page.locator('g').filter({ hasText: /^0055101015152020Size001122334455$/ }).locator('rect').nth(1).
    dragTo(page.getByText('15', { exact: true }).nth(1), {force: true});
  await expect(page.getByText('15').nth(3)).toBeVisible();

  // Ensure that adding sets doesn't affect the advanced scale
  await addSetByName(page, 'Blue Hair');
  await expect(page.getByText('15').nth(3)).toBeVisible();
  
  // Ensure that scale recalculates correctly when advanced is turned off
  await toggleAdvancedScale(page);
  await expect(page.locator('g').filter({ hasText: /^33$/ }).locator('text').nth(1)).toBeVisible();
});