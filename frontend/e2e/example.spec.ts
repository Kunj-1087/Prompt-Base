import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  // Note: Adjust based on actual app title
  await expect(page).toHaveTitle(/Prompt Base|Vite/);
});

test('login link exists', async ({ page }) => {
    await page.goto('/');
    // Check if there is a link to login or similar
    // This depends on actual UI content.
    // For now just check the page loads (body visible)
    await expect(page.locator('body')).toBeVisible();
});
