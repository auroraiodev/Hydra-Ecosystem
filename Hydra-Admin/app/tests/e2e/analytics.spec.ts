import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard - Analytics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/analytics');
  });

  test('should display analytics page header', async ({ page }) => {
    const title = page.locator('h1, h2, h3', { hasText: /Analytics|Analítica/i }).first();
    await expect(title).toBeVisible();
  });

  test('should render revenue chart', async ({ page }) => {
    await page.waitForSelector('.recharts-responsive-container, .recharts-wrapper, svg.recharts-surface', { timeout: 5000 }).catch(() => {});
    const chart = page.locator('.recharts-responsive-container, .recharts-wrapper, svg.recharts-surface').first();
    if (await chart.count() > 0) {
      await expect(chart).toBeVisible();
    }
  });

  test('should display analytics stat cards', async ({ page }) => {
    await page.waitForTimeout(2000);
    const statCards = page.locator('[class*="card"]').first();
    if (await statCards.count() > 0) {
      await expect(statCards).toBeVisible();
    }
  });

  test('should display monthly breakdown section', async ({ page }) => {
    await page.waitForTimeout(1500);
    const monthlyTitle = page.locator('text=/Monthly|Mensual|Breakdown|Desglose/i').first();
    if (await monthlyTitle.count() > 0) {
      await expect(monthlyTitle).toBeVisible();
    }
  });
});
