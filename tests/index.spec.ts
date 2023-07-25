import { test, expect } from '@playwright/test';

test('job_infos/search_results', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveScreenshot({ fullPage: true });
});
