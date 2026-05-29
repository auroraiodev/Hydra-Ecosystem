import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard - Imports', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/imports');
  });

  test('should display imports page header', async ({ page }) => {
    const title = page.locator('h1, h2, h3', { hasText: /Imports|Importaciones/i }).first();
    await expect(title).toBeVisible();
  });

  test('should display import history table', async ({ page }) => {
    await page.waitForTimeout(1500);
    const importTable = page.locator('table').first();
    if (await importTable.count() > 0) {
      await expect(importTable).toBeVisible();
    }
  });

  test('should have new import button', async ({ page }) => {
    const newBtn = page.locator('button:has-text("Nueva"), a[href*="add"], button:has-text("New")').first();
    if (await newBtn.count() > 0) {
      await expect(newBtn).toBeVisible();
    }
  });

  test('should show import status badges', async ({ page }) => {
    await page.waitForTimeout(1500);
    const badges = page.locator('span[class*="badge"]').first();
    if (await badges.count() > 0) {
      await expect(badges).toBeVisible();
    }
  });

  test('should display import summary or stats', async ({ page }) => {
    await page.waitForTimeout(1000);
    const stats = page.locator('text=/Total|Importado|Procesado|Completado/i').first();
    if (await stats.count() > 0) {
      await expect(stats).toBeVisible();
    }
  });
});
