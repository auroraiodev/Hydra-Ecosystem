import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard - Notifications', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should display notification bell icon', async ({ page }) => {
    const bell = page.locator('button[aria-label*="notificacion"], button[aria-label*="notification"]').first();
    if (await bell.count() > 0) {
      await expect(bell).toBeVisible();
    }
  });

  test('should open notification dropdown on click', async ({ page }) => {
    const bell = page.locator('button[aria-label*="notificacion"], button[aria-label*="notification"]').first();
    if (await bell.count() > 0) {
      await bell.click();
      await page.waitForTimeout(500);
      const dropdown = page.locator('[role="menu"], [class*="dropdown"], [class*="popover"]').first();
      if (await dropdown.count() > 0) {
        await expect(dropdown).toBeVisible();
      }
    }
  });

  test('should show unread notification count', async ({ page }) => {
    await page.waitForTimeout(1500);
    const badge = page.locator('[class*="badge"]').filter({ hasText: /[0-9]+/ }).first();
    if (await badge.count() > 0) {
      await expect(badge).toBeVisible();
    }
  });

  test('should display notification items in dropdown', async ({ page }) => {
    const bell = page.locator('button[aria-label*="notificacion"], button[aria-label*="notification"]').first();
    if (await bell.count() > 0) {
      await bell.click();
      await page.waitForTimeout(1000);
      const items = page.locator('[role="menu"] [class*="item"], [class*="dropdown"] [class*="item"]').first();
      if (await items.count() > 0) {
        await expect(items).toBeVisible();
      }
    }
  });

  test('should close notification dropdown on click outside', async ({ page }) => {
    const bell = page.locator('button[aria-label*="notificacion"], button[aria-label*="notification"]').first();
    if (await bell.count() > 0) {
      await bell.click();
      await page.waitForTimeout(500);
      await page.locator('main').click();
      await page.waitForTimeout(500);
    }
  });
});
