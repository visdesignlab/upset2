import { expect, test } from '@playwright/test';
import { beforeTest } from './common';

test.beforeEach(beforeTest);

test('Query by Sets', async ({ page }) => {
  await page.goto('http://localhost:3000/?workspace=Upset+Examples&table=simpsons&sessionId=193');

  // open Query by sets interface
  await page.getByTestId('AddIcon').locator('path').click();
  // await page.getByLabel('Query By Sets').locator('rect').click();

  // select first two sets as 'No', third as 'Yes'
  await page.locator('g:nth-child(2) > g > circle').first().click();
  await page.locator('g:nth-child(2) > g > circle:nth-child(3)').click();
  await page.locator('g:nth-child(4) > g > circle:nth-child(4)').click();

  // TODO: Add a test for changing the name. As is, playwright struggles to handle web dialog inputs

  // Ensure that the text is correct
  await page.getByText('intersections of set [Evil]').click();

  // Add the query
  await page.getByLabel('Add query').locator('rect').click();

  // This specific query size is 5
  await page.locator('text').filter({ hasText: /^5$/ }).click();

  // Remove the query
  await page.getByLabel('Remove query').locator('rect').click();
});
