import { test, expect } from '@playwright/test';
import { beforeTest } from './common';

test.beforeEach(beforeTest);

/**
 * Asserts that trrack history works for selecting and deselecting rows, provenance tree is displayed correctly,
 * reverting to an earlier state works, elementView row deselection is trracked,
 *  and aggregate rows can be selected and deselected.
 */
test('Selection History', async ({ page }) => {
  await page.goto('http://localhost:3000/?workspace=Upset+Examples&table=simpsons&sessionId=193');
  await page.getByLabel('Additional options menu').click();
  await page.getByLabel('History tree sidebar').click();

  const schoolIntersection = page.locator('#Subset_School > g:nth-child(4)');
  const duffFanIntersection = page.locator('[id="Subset_Duff_Fan\\~\\&\\~Male"] > g:nth-child(4)');

  // Testing history for a subset selection & deselection
  await page.locator('g > circle').first().click();
  await page.locator('g > circle').first().click();
  await expect(page.locator('div').filter({ hasText: /^Select intersection "School & Male"$/ }).nth(2)).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Deselect intersection$/ }).nth(2)).toBeVisible();

  // Testing history for an aggregate row selection & deselection
  await page.getByRole('radio', { name: 'Degree' }).check();
  await page.locator('g').filter({ hasText: /^Degree 3Degree 3$/ }).locator('rect').click();
  await expect(page.locator('div').filter({ hasText: /^Select intersection "Degree 3"$/ }).nth(2)).toBeVisible();
  await page.locator('g').filter({ hasText: /^Degree 3Degree 3$/ }).locator('rect').click();
  await expect(page.getByText('Deselect intersection').nth(1)).toBeVisible();

  // Check that selections are maintained after de-aggregation
  await schoolIntersection.click();
  await page.getByRole('radio', { name: 'None' }).check();
  await schoolIntersection.click();
  await expect(page.getByText('Deselect intersection').nth(2)).toBeVisible();

  // Check that selections can be reverted & start a new history tree branch
  await page.locator('g:nth-child(10) > circle').click();
  await schoolIntersection.click();
  await duffFanIntersection.click();
  await expect(page.getByLabel('History Sidebar').getByText('Select intersection "School"')).toBeVisible();
  // Check that deselection triggered by element view unbookmarking is reflected in history tree.
  // Also tests that the bookmarking & unbookmarking is trracked
  await page.getByLabel('Element View Sidebar Toggle').click();
  await page.locator('svg[data-testid="StarBorderIcon"]').click();
  await page.locator('span.MuiChip-label+svg[data-testid="StarIcon"]').click();
  await page.getByLabel('Additional options menu').click();
  await page.getByLabel('History tree sidebar').click();

  await expect(page.getByText('Unbookmark Duff Fan & Male')).toBeVisible();
  await expect(page.getByText('Deselect intersection')).toBeVisible();
  await expect(page.getByText('Bookmark Duff Fan & Male', { exact: true })).toBeVisible();
  await expect(page.getByLabel('History Sidebar').getByText('Select intersection "School"')).toBeVisible();
});

/**
 * Tests that overlap history works
 * & doesn't produce duplicate actions when the overlap degree is changed to the same value
 */
test('Overlap History', async ({ page }) => {
  await page.goto('http://localhost:3000/?workspace=Upset+Examples&table=simpsons&sessionId=193');
  await page.getByLabel('Additional options menu').click();
  await page.getByLabel('History tree sidebar').click();

  // Ensure that duplicate actions aren't recorded for decreasing first degree
  await page.getByRole('radio', { name: 'Overlaps' }).check();
  await page.getByRole('spinbutton', { name: 'Degree' }).click();
  await page.getByRole('spinbutton', { name: 'Degree' }).press('ArrowDown');
  await expect(page.getByText('First overlap by 2')).toHaveCount(0);

  // Try to increment degree to 7 (limit is 6); confirm no duplicate at any level
  await page.getByRole('spinbutton', { name: 'Degree' }).press('ArrowUp');
  await page.getByRole('spinbutton', { name: 'Degree' }).press('ArrowUp');
  await page.getByRole('spinbutton', { name: 'Degree' }).press('ArrowUp');
  await page.getByRole('spinbutton', { name: 'Degree' }).press('ArrowUp');
  await page.getByRole('spinbutton', { name: 'Degree' }).press('ArrowUp');
  await expect(page.getByText('First overlap by 3')).toHaveCount(1);
  await expect(page.getByText('First overlap by 4')).toHaveCount(1);
  await expect(page.getByText('First overlap by 5')).toHaveCount(1);
  await expect(page.getByText('First overlap by 6')).toHaveCount(1);

  // Switch to second aggregation by overlap
  await page.getByRole('radio', { name: 'Deviations' }).check();
  await page.getByRole('button', { name: 'Second Aggregation' }).click();
  await page.locator('div').filter({ hasText: /^Second AggregationDegreeSetsOverlapsNone$/ })
    .getByLabel('Overlaps', { exact: true }).check();
  await page.getByRole('spinbutton', { name: 'Degree' }).click();

  // Ensure no duplicate action for decreasing 2nd degree
  await page.getByRole('spinbutton', { name: 'Degree' }).press('ArrowDown');
  await expect(page.getByText('Second overlap by 2')).toHaveCount(0);

  // Try to increment degree to 7; confirm no duplicates
  await page.getByRole('spinbutton', { name: 'Degree' }).press('ArrowUp');
  await page.getByRole('spinbutton', { name: 'Degree' }).press('ArrowUp');
  await page.getByRole('spinbutton', { name: 'Degree' }).press('ArrowUp');
  await page.getByRole('spinbutton', { name: 'Degree' }).press('ArrowUp');
  await page.getByRole('spinbutton', { name: 'Degree' }).press('ArrowUp');
  await expect(page.getByText('Second overlap by 3')).toHaveCount(1);
  await expect(page.getByText('Second overlap by 4')).toHaveCount(1);
  await expect(page.getByText('Second overlap by 5')).toHaveCount(1);
  await expect(page.getByText('Second overlap by 6')).toHaveCount(1);
});
