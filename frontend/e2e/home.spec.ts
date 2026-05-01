import { test, expect } from '@playwright/test';

test('home page loads and displays main heading', async ({ page }) => {
  await page.goto('/');
  const heading = page.locator('h1, h2, [class*="title"]').filter({ hasText: 'Vortex Royale' });
  await expect(heading).toBeVisible();
});
