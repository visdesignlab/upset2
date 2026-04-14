import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { parseDateValue } from '../packages/core/src/utils';
import mockAnnotations from '../playwright/mock-data/date-attributes/date_attributes_annotations.json' with { type: 'json' };
import mockData from '../playwright/mock-data/date-attributes/date_attributes_data.json' with { type: 'json' };

async function mockDateAttributeDataset(page: Page) {
  await page.route('*/**/api/**', async (route) => {
    const url = route.request().url();

    if (
      url.includes(
        'workspaces/Upset%20Examples/tables/date_attributes/rows/?limit=9007199254740991',
      )
    ) {
      await route.fulfill({ json: mockData });
    } else if (
      url.includes('workspaces/Upset%20Examples/tables/date_attributes/annotations/')
    ) {
      await route.fulfill({ json: mockAnnotations });
    } else if (url.includes('workspaces/Upset%20Examples/sessions/table/194/')) {
      await route.fulfill({ status: 200 });
    } else if (url.includes('workspaces/Upset%20Examples/permissions/me')) {
      await route.fulfill({
        status: 200,
        json: {
          permission: 3,
          permission_label: 'maintainer',
          public: true,
          username: 'test',
          workspace: 'Upset Examples',
        },
      });
    } else if (url.includes('api/users/me')) {
      await route.fulfill({
        status: 200,
        json: {
          username: 'test',
          workspace: 'Upset Examples',
          permission: 3,
          permission_label: 'maintainer',
          public: true,
        },
      });
    } else {
      await route.continue();
    }
  });
}

test('date attributes render formatted scales', async ({ page }) => {
  await mockDateAttributeDataset(page);
  await page.goto(
    'http://localhost:3000/?workspace=Upset+Examples&table=date_attributes&sessionId=194',
  );

  await expect(page.locator('#header-text-ReleaseDate')).toBeVisible();
  await expect(page.locator('#header-text-Premiere')).toBeVisible();
  await expect(page.getByRole('dialog', { name: 'Import Error' })).toHaveCount(0);
  await expect(page.locator('text').filter({ hasText: /^\d{4}$/ }).first()).toBeVisible();
  await expect(
    page
      .locator('text')
      .filter({ hasText: /Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/ })
      .first(),
  ).toBeVisible();
  await expect(page.locator('text').filter({ hasText: /^\d{13}$/ })).toHaveCount(0);
});

test('ambiguous slash-formatted dates are ignored', async () => {
  expect(parseDateValue('03/04/2024')).toBeUndefined();
});
