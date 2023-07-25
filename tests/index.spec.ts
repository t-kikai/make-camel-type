import { test, expect } from '@playwright/test';

test('index', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveScreenshot({ fullPage: true });
});
