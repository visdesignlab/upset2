import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { beforeTest } from './common';
import { RightSidebar } from '@visdesignlab/upset2-core';

test.beforeEach(beforeTest);

/**
 * Generate the embed link for the given settings.
 * @param showSettings Whether to show the left settings sidebar.
 * @param sidebar The type of right sidebar to show.
 * @returns The generated embed link.
 */
function generateLink(showSettings: boolean, sidebar: RightSidebar) {
  return `http://localhost:3000/embed?workspace=Upset+Examples&table=simpsons&sessionId=193&showSettings=${showSettings ? 1 : 0}&sidebar=${sidebar}`;
}

async function goToLink(page: Page, showSettings: boolean, sidebar: RightSidebar) {
  await page.goto(generateLink(showSettings, sidebar));
  await page.waitForTimeout(1000); // let er load (she slow, don't ask me why the other tests don't need this)
}

test('Embed Modal', async ({ page }) => {
  await page.goto(
    'http://localhost:3000/?workspace=Upset+Examples&table=simpsons&sessionId=193',
  );

  await page.waitForTimeout(1000); // let er load (she slow)

  await page.getByRole('button', { name: 'Additional options menu' }).click();
  await page.getByRole('menuitem', { name: 'Get Embed Link' }).click();
  await expect(page.getByRole('code')).toContainText(
    generateLink(false, RightSidebar.NONE),
  );
  await page.getByRole('switch', { name: 'Show Left Settings Sidebar' }).check();
  await expect(page.getByRole('code')).toContainText(
    generateLink(true, RightSidebar.NONE),
  );
  await page.getByRole('combobox', { name: 'Right Sidebar None' }).click();
  await page.getByRole('option', { name: 'Element View Sidebar' }).click();
  await expect(page.getByRole('code')).toContainText(
    generateLink(true, RightSidebar.ELEMENT),
  );
  await page.getByRole('combobox', { name: 'Right Sidebar Element View' }).click();
  await page.getByRole('option', { name: 'Text Descriptions' }).click();
  await expect(page.getByRole('code')).toContainText(
    generateLink(true, RightSidebar.ALTTEXT),
  );
  await expect(page.getByRole('button', { name: 'Copy embed link' })).toBeVisible();
  await page.getByRole('button', { name: 'Copy embed link' }).click();
  await expect(page.getByRole('button', { name: 'Copied to clipboard' })).toBeVisible();

  await goToLink(page, true, RightSidebar.NONE);

  const settingsHeader = page.getByRole('heading', { name: 'Settings' });
  await expect(settingsHeader).toBeVisible();
  await settingsHeader.getByRole('button').click();
  await expect(page.getByRole('button').filter({ hasText: /^$/ })).toBeVisible();
  await expect(settingsHeader).not.toBeVisible();

  await goToLink(page, false, RightSidebar.ELEMENT);

  await expect(page.getByRole('heading', { name: 'Element View' })).toBeVisible();
  await expect(settingsHeader).not.toBeVisible();

  await goToLink(page, false, RightSidebar.ALTTEXT);

  await expect(page.getByRole('heading', { name: 'Text Description' })).toBeVisible();
});
