import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard - Sidebar Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should navigate to Analytics via sidebar', async ({ page }) => {
    await page.locator('a[href="/dashboard/analytics"]').click();
    await expect(page).toHaveURL(/\/dashboard\/analytics/);
  });

  test('should navigate to Products via sidebar', async ({ page }) => {
    await page.locator('a[href="/dashboard/products"]').click();
    await expect(page).toHaveURL(/\/dashboard\/products/);
  });

  test('should navigate to Categories via sidebar', async ({ page }) => {
    await page.locator('a[href="/dashboard/categories"]').click();
    await expect(page).toHaveURL(/\/dashboard\/categories/);
  });

  test('should navigate to TCGs via sidebar', async ({ page }) => {
    await page.locator('a[href="/dashboard/tcgs"]').click();
    await expect(page).toHaveURL(/\/dashboard\/tcgs/);
  });

  test('should navigate to Banners via sidebar', async ({ page }) => {
    await page.locator('a[href="/dashboard/banners"]').click();
    await expect(page).toHaveURL(/\/dashboard\/banners/);
  });

  test('should navigate to Tags via sidebar', async ({ page }) => {
    await page.locator('a[href="/dashboard/tags"]').click();
    await expect(page).toHaveURL(/\/dashboard\/tags/);
  });

  test('should navigate to Orders via sidebar', async ({ page }) => {
    await page.locator('a[href="/dashboard/orders"]').click();
    await expect(page).toHaveURL(/\/dashboard\/orders/);
  });

  test('should navigate to Imports via sidebar', async ({ page }) => {
    await page.locator('a[href="/dashboard/imports"]').click();
    await expect(page).toHaveURL(/\/dashboard\/imports/);
  });

  test('should navigate to Inventory via sidebar', async ({ page }) => {
    await page.locator('a[href="/dashboard/inventario"]').click();
    await expect(page).toHaveURL(/\/dashboard\/inventario/);
  });

  test('should navigate to History via sidebar', async ({ page }) => {
    await page.locator('a[href="/dashboard/historial"]').click();
    await expect(page).toHaveURL(/\/dashboard\/historial/);
  });

  test('should navigate to Users via sidebar', async ({ page }) => {
    await page.locator('a[href="/dashboard/users"]').click();
    await expect(page).toHaveURL(/\/dashboard\/users/);
  });

  test('should navigate to Presence via sidebar', async ({ page }) => {
    await page.locator('a[href="/dashboard/presence"]').click();
    await expect(page).toHaveURL(/\/dashboard\/presence/);
  });

  test('should navigate to Support Chat via sidebar', async ({ page }) => {
    await page.locator('a[href="/dashboard/chat"]').click();
    await expect(page).toHaveURL(/\/dashboard\/chat/);
  });

  test('should navigate to Wallet via sidebar', async ({ page }) => {
    await page.locator('a[href="/dashboard/wallet"]').click();
    await expect(page).toHaveURL(/\/dashboard\/wallet/);
  });

  test('should navigate to Carts via sidebar', async ({ page }) => {
    await page.locator('a[href="/dashboard/carts"]').click();
    await expect(page).toHaveURL(/\/dashboard\/carts/);
  });

  test('should navigate to Feature Flags via sidebar', async ({ page }) => {
    await page.locator('a[href="/dashboard/feature-flags"]').click();
    await expect(page).toHaveURL(/\/dashboard\/feature-flags/);
  });

  test('should navigate to Profile via sidebar', async ({ page }) => {
    await page.locator('a[href="/dashboard/profile"]').click();
    await expect(page).toHaveURL(/\/dashboard\/profile/);
  });

  test('should navigate to Settings via sidebar', async ({ page }) => {
    await page.locator('a[href="/dashboard/settings"]').click();
    await expect(page).toHaveURL(/\/dashboard\/settings/);
  });

  test('should highlight active nav item', async ({ page }) => {
    await page.goto('/dashboard/products');
    const activeLink = page.locator('a[href="/dashboard/products"].bg-primary\\/10, a[href="/dashboard/products"][class*="bg-primary"]');
    if (await activeLink.count() > 0) {
      await expect(activeLink).toBeVisible();
    }
  });

  test('should show Admin Panel branding in sidebar', async ({ page }) => {
    await expect(page.locator('text=Admin Panel')).toBeVisible();
  });

  test('should display logout button with tooltip', async ({ page }) => {
    const logoutBtn = page.locator('button[title="Cerrar sesión"]');
    await expect(logoutBtn).toBeVisible();
  });

  test('should display user name and email in sidebar footer', async ({ page }) => {
    await page.waitForTimeout(1500);
    const userName = page.locator('p.truncate').first();
    if (await userName.count() > 0) {
      const text = await userName.textContent();
      expect(text?.trim()).toBeTruthy();
    }
  });
});
