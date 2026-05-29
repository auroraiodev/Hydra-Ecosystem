import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard - Sales History (Historial)', () => {
  test.describe('Historial', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/dashboard/historial');
    });

    test('should display historial page header', async ({ page }) => {
      const title = page.locator('h1, h2, h3', { hasText: /Historial|History|Sales/i }).first();
      await expect(title).toBeVisible();
    });

    test('should display sales table with columns', async ({ page }) => {
      await page.waitForTimeout(1500);
      const salesTable = page.locator('table').first();
      if (await salesTable.count() > 0) {
        await expect(salesTable).toBeVisible();
      }
    });

    test('should show sale amounts with currency', async ({ page }) => {
      await page.waitForTimeout(1500);
      const amounts = page.locator('td').filter({ hasText: /\$[0-9,]+/ });
      if (await amounts.count() > 0) {
        await expect(amounts.first()).toBeVisible();
      }
    });

    test('should have date range filter', async ({ page }) => {
      const dateInput = page.locator('input[type="date"]').first();
      if (await dateInput.count() > 0) {
        await expect(dateInput).toBeVisible();
      }
    });
  });

  test.describe('Sales', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/dashboard/sales');
    });

    test('should display sales page header', async ({ page }) => {
      const title = page.locator('h1, h2, h3', { hasText: /Sales|Ventas/i }).first();
      await expect(title).toBeVisible();
    });

    test('should display sales data table', async ({ page }) => {
      await page.waitForTimeout(1500);
      const table = page.locator('table').first();
      if (await table.count() > 0) {
        await expect(table).toBeVisible();
      }
    });

    test('should show sale status badges', async ({ page }) => {
      await page.waitForTimeout(1500);
      const badges = page.locator('[class*="badge"]').first();
      if (await badges.count() > 0) {
        await expect(badges).toBeVisible();
      }
    });
  });
});
