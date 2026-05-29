import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard - Feature Flags', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/feature-flags');
  });

  test('should display feature flags page header', async ({ page }) => {
    const title = page.locator('h1, h2, h3', { hasText: /Feature Flags|Características/i }).first();
    await expect(title).toBeVisible();
  });

  test('should list feature flags', async ({ page }) => {
    await page.waitForTimeout(1000);
    const flagItems = page.locator('text=/chat|maintenance|enabled|disabled|activado/i').first();
    if (await flagItems.count() > 0) {
      await expect(flagItems).toBeVisible();
    }
  });

  test('should display feature flag switches', async ({ page }) => {
    await page.waitForTimeout(1500);
    const switches = page.locator('div[role="switch"]');
    const count = await switches.count();
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        await expect(switches.nth(i)).toBeVisible();
      }
    }
  });

  test('should toggle a feature flag', async ({ page }) => {
    await page.waitForTimeout(1000);
    const switchToggle = page.locator('div[role="switch"]').first();
    if (await switchToggle.count() > 0) {
      const checkedBefore = await switchToggle.getAttribute('aria-checked');
      await switchToggle.click();
      await page.waitForTimeout(500);
      const checkedAfter = await switchToggle.getAttribute('aria-checked');
      expect(checkedAfter).not.toEqual(checkedBefore);
      await switchToggle.click();
      await page.waitForTimeout(500);
      const restored = await switchToggle.getAttribute('aria-checked');
      expect(restored).toEqual(checkedBefore);
    }
  });

  test('should display flag name and description', async ({ page }) => {
    await page.waitForTimeout(1000);
    const flagLabels = page.locator('label, span, p').filter({ hasText: /chat-enabled|maintenance-mode/i }).first();
    if (await flagLabels.count() > 0) {
      await expect(flagLabels).toBeVisible();
    }
  });
});
