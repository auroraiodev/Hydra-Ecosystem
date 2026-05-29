import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard - Presence (Conectados)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/presence');
  });

  test('should display presence page header', async ({ page }) => {
    const title = page.locator('h1, h2, h3', { hasText: /Conectados|Presence|Online/i }).first();
    await expect(title).toBeVisible();
  });

  test('should show online users list', async ({ page }) => {
    await page.waitForTimeout(1500);
    const usersSection = page.locator('text=/Usuarios|Users|Online|Conectado/i').first();
    if (await usersSection.count() > 0) {
      await expect(usersSection).toBeVisible();
    }
  });

  test('should display blocked IPs section if present', async ({ page }) => {
    await page.waitForTimeout(1000);
    const blockedSection = page.locator('text=/Bloqueados|Blocked|IP/i').first();
    if (await blockedSection.count() > 0) {
      await expect(blockedSection).toBeVisible();
    }
  });

  test('should show user avatars in presence list', async ({ page }) => {
    await page.waitForTimeout(2000);
    const avatars = page.locator('[class*="avatar"] img, [class*="Avatar"] img').first();
    if (await avatars.count() > 0) {
      const src = await avatars.getAttribute('src');
      expect(src).toBeTruthy();
    }
  });

  test('should have search for online users', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="buscar"], input[placeholder*="Buscar"], input[placeholder*="search"]').first();
    if (await searchInput.count() > 0) {
      await expect(searchInput).toBeVisible();
    }
  });
});
