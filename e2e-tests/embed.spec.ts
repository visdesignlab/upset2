import { test, expect } from '@playwright/test';
import { beforeTest } from './common';

test.beforeEach(beforeTest);

test('Embed Modal', async ({ page }) => {
  await page.goto(
    'http://localhost:3000/?workspace=Upset+Examples&table=simpsons&sessionId=193',
  );

  console.log('here');

  await page.waitForTimeout(1000); // let er load (she slow)

  await page.getByRole('button', { name: 'Additional options menu' }).click();
  await page.getByRole('menuitem', { name: 'Get Embed Link' }).click();
});
