import { test, expect, Page } from '@playwright/test';
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

const SIZE_ORDER = {
  Ascending: [
    'Subset_School',
    'Subset_School~&amp;~Evil~&amp;~Male',
    'Subset_School~&amp;~Blue_Hair~&amp;~Male',
    'Subset_Duff_Fan~&amp;~Evil~&amp;~Male',
    'Subset_Evil~&amp;~Male',
  ],
  Descending: [
    'Subset_School~&amp;~Male',
    'Subset_Unincluded',
    'Subset_Male',
    'Subset_Duff_Fan~&amp;~Male~&amp;~Power Plant',
    'Subset_Evil~&amp;~Male',
  ],
};

const DEGREE_ORDER = {
  Ascending: [
    'Subset_Unincluded',
    'Subset_Blue_Hair',
    'Subset_Male',
    'Subset_School',
    'Subset_Duff_Fan~&amp;~Male',
  ],
  Descending: [
    'Subset_Duff_Fan~&amp;~Evil~&amp;~Male',
    'Subset_Duff_Fan~&amp;~Male~&amp;~Power Plant',
    'Subset_Evil~&amp;~Male~&amp;~Power_Plant',
    'Subset_School~&amp;~Blue_Hair~&amp;~Male',
    'Subset_School~&amp;~Evil~&amp;~Male',
  ],
};

const DEVIATION_ORDER = {
  Ascending: [
    'Subset_Male',
    'Subset_Evil~&amp;~Male',
    'Subset_Duff_Fan~&amp;~Male',
    'Subset_School',
    'Subset_School~&amp;~Evil~&amp;~Male',
  ],
  Descending: [
    'Subset_Duff_Fan~&amp;~Male~&amp;~Power Plant',
    'Subset_Blue_Hair',
    'Subset_Evil~&amp;~Male~&amp;~Power_Plant',
    'Subset_School~&amp;~Male',
    'Subset_Unincluded',
  ],
};

// Note: the keys in this object represent the VISIBLE SET sort order
const SET_MALE_ORDER = {
  Alphabetical: [
    'Subset_Male',
    'Subset_Duff_Fan~&amp;~Male',
    'Subset_Evil~&amp;~Male',
    'Subset_School~&amp;~Male',
    'Subset_Duff_Fan~&amp;~Evil~&amp;~Male',
  ],
  Ascending: [
    'Subset_Male',
    'Subset_School~&amp;~Male',
    'Subset_Evil~&amp;~Male',
    'Subset_Duff_Fan~&amp;~Male',
    'Subset_School~&amp;~Blue_Hair~&amp;~Male',
  ],
  Descending: [
    'Subset_Male',
    'Subset_School~&amp;~Male',
    'Subset_Evil~&amp;~Male',
    'Subset_Duff_Fan~&amp;~Male',
    'Subset_School~&amp;~Evil~&amp;~Male',
  ],
};

/**
 * Compares the sorted elements on a page with the given order.
 *
 * @param {Page} page - The playwright page object.
 * @param {string[]} order - The expected order of elements.
 * @returns {Promise<void>} - A promise that resolves when the comparison is complete.
 */
async function compareSortedElements(page: Page, order: string[]) {
  const gElements = await page.locator('#matrixRows > g').all();

  const res = (await Promise.all(gElements.map((gElement) => gElement.innerHTML()))).slice(0, 5);

  for (let i = 0; i < order.length; i++) {
    expect(res[i]).toContain(order[i]);
  }
}

test('Sort by Size', async ({ page }) => {
  await page.goto('http://localhost:3000/?workspace=Upset+Examples&table=simpsons&sessionId=193');

  /// Ascending
  await page.getByText('Size', { exact: true }).click();
  await compareSortedElements(page, SIZE_ORDER.Ascending);

  /// Descending
  await page.getByText('Size', { exact: true }).click();
  await compareSortedElements(page, SIZE_ORDER.Descending);
});

test('Sort by Degree', async ({ page }) => {
  await page.goto('http://localhost:3000/?workspace=Upset+Examples&table=simpsons&sessionId=193');

  /// Ascending
  await page.getByText('#').dispatchEvent('click');
  await compareSortedElements(page, DEGREE_ORDER.Ascending);

  /// Descending
  await page.getByText('#').dispatchEvent('click');
  await compareSortedElements(page, DEGREE_ORDER.Descending);
});

test('Sort by Deviation', async ({ page }) => {
  await page.goto('http://localhost:3000/?workspace=Upset+Examples&table=simpsons&sessionId=193');

  /// Ascending
  await page.getByLabel('Deviation', { exact: true }).locator('rect').dispatchEvent('click');
  await compareSortedElements(page, DEVIATION_ORDER.Ascending);

  /// Descending
  await page.getByLabel('Deviation', { exact: true }).locator('rect').dispatchEvent('click');
  await compareSortedElements(page, DEVIATION_ORDER.Descending);
});

test('Sort by Set Male', async ({ page }) => {
  await page.goto('http://localhost:3000/?workspace=Upset+Examples&table=simpsons&sessionId=193');

  /// Only one option for sortOrder for sets
  await page.locator('p').filter({ hasText: /^Male$/ }).click();
  await compareSortedElements(page, SET_MALE_ORDER.Alphabetical);

  // Sort visible sets by size, ascending
  // male is largest, so this should put it at the end.
  // This will alter the order of the sets
  await page.locator('p').filter({ hasText: /^Male$/ }).dispatchEvent('contextmenu');
  await page.getByRole('menuitem', { name: 'Sort Sets by Size - Ascending' }).click();

  await compareSortedElements(page, SET_MALE_ORDER.Ascending);

  await page.locator('p').filter({ hasText: /^Male$/ }).dispatchEvent('contextmenu');
  await page.getByRole('menuitem', { name: 'Sort Sets by Size - Descending' }).click();

  await compareSortedElements(page, SET_MALE_ORDER.Descending);
});
