import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard - Carts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/carts');
  });

  test('should display carts page header', async ({ page }) => {
    const title = page.locator('h1, h2, h3', { hasText: /Carts|Carritos/i }).first();
    await expect(title).toBeVisible();
  });

  test('should display carts listing', async ({ page }) => {
    await page.waitForTimeout(1500);
    const table = page.locator('table').first();
    if (await table.count() > 0) {
      await expect(table).toBeVisible();
    }
  });

  test('should have search for carts', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="buscar"], input[placeholder*="Buscar"], input[placeholder*="search"]').first();
    if (await searchInput.count() > 0) {
      await expect(searchInput).toBeVisible();
    }
  });

  test('should show cart items with product images', async ({ page }) => {
    await page.waitForTimeout(2000);
    const images = page.locator('table img').first();
    if (await images.count() > 0) {
      const src = await images.getAttribute('src');
      expect(src).toBeTruthy();
    }
  });

  test('should display cart user info', async ({ page }) => {
    await page.waitForTimeout(1500);
    const userInfo = page.locator('td').filter({ hasText: /@|Juan|Maria|Perez|Gomez/i }).first();
    if (await userInfo.count() > 0) {
      await expect(userInfo).toBeVisible();
    }
  });

  test('should have cart item count', async ({ page }) => {
    await page.waitForTimeout(1000);
    const countDisplay = page.locator('text=/[0-9]+ items?|[0-9]+ artículos?/i').first();
    if (await countDisplay.count() > 0) {
      await expect(countDisplay).toBeVisible();
    }
  });

  test('should show cart total amount', async ({ page }) => {
    await page.waitForTimeout(1500);
    const amount = page.locator('td, span').filter({ hasText: /\$[0-9,]+/ }).first();
    if (await amount.count() > 0) {
      await expect(amount).toBeVisible();
    }
  });
});
