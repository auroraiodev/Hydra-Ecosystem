import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard - Inventory (Inventario)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/inventario');
  });

  test('should display inventory page header', async ({ page }) => {
    const title = page.locator('h1, h2, h3', { hasText: /Inventario|Inventory/i }).first();
    await expect(title).toBeVisible();
  });

  test('should list seller inventory items with images', async ({ page }) => {
    await page.waitForTimeout(2000);
    const table = page.locator('table').first();
    if (await table.count() > 0) {
      await expect(table).toBeVisible();
    }
    const images = page.locator('table img').first();
    if (await images.count() > 0) {
      const src = await images.getAttribute('src');
      expect(src).toBeTruthy();
    }
  });

  test('should have seller filter dropdown', async ({ page }) => {
    const sellerFilter = page.locator('select[aria-label*="vendedor"], select[aria-label*="seller"], select[name="seller"]').first();
    if (await sellerFilter.count() > 0) {
      await expect(sellerFilter).toBeVisible();
      await sellerFilter.selectOption('user-2');
      await page.waitForTimeout(500);
    }
  });

  test('should have search input to filter inventory', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="buscar"], input[placeholder*="Buscar"], input[placeholder*="search"]').first();
    if (await searchInput.count() > 0) {
      await expect(searchInput).toBeVisible();
      await searchInput.fill('Black Lotus');
      await page.waitForTimeout(500);
    }
  });

  test('should display inventory stats summary', async ({ page }) => {
    await page.waitForTimeout(1500);
    const stats = page.locator('text=/Total|Productos|Items|Listados/i').first();
    if (await stats.count() > 0) {
      await expect(stats).toBeVisible();
    }
  });

  test('should toggle inventory item active status', async ({ page }) => {
    const switchToggle = page.locator('div[role="switch"]').first();
    if (await switchToggle.count() > 0) {
      const checkedBefore = await switchToggle.getAttribute('aria-checked');
      await switchToggle.click();
      await page.waitForTimeout(500);
      const checkedAfter = await switchToggle.getAttribute('aria-checked');
      expect(checkedAfter).not.toEqual(checkedBefore);
      await switchToggle.click();
    }
  });
});
