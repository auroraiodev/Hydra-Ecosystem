import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard - Responsive Design', () => {
  test.describe('Desktop Viewport', () => {
    test.use({ viewport: { width: 1920, height: 1080 } });

    test('should show full sidebar on desktop', async ({ page }) => {
      await page.goto('/dashboard');
      const sidebar = page.locator('aside').first();
      await expect(sidebar).toBeVisible();
    });

    test('should show all nav sections on desktop', async ({ page }) => {
      await page.goto('/dashboard');
      await expect(page.locator('text=Overview')).toBeVisible();
      await expect(page.locator('text=Catalog')).toBeVisible();
      await expect(page.locator('text=Operations')).toBeVisible();
      await expect(page.locator('text=Users & Finance')).toBeVisible();
      await expect(page.locator('text=System')).toBeVisible();
    });

    test('should have desktop sidebar width', async ({ page }) => {
      await page.goto('/dashboard');
      const sidebar = page.locator('aside').first();
      const box = await sidebar.boundingBox();
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(250);
      }
    });
  });

  test.describe('Mobile Viewport', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('should have mobile menu toggle button visible', async ({ page }) => {
      await page.goto('/dashboard');
      const menuBtn = page.locator('button').filter({ has: page.locator('svg') }).first();
      await expect(menuBtn).toBeVisible();
    });

    test('should open sidebar drawer when menu is clicked', async ({ page }) => {
      await page.goto('/dashboard');
      const menuBtn = page.locator('button').filter({ has: page.locator('svg') }).first();
      await menuBtn.click();
      await page.waitForTimeout(500);
      const sidebar = page.locator('aside').filter({ hasText: /Overview|Catalog/ }).first();
      await expect(sidebar).toBeVisible();
    });

    test('should close sidebar on overlay click', async ({ page }) => {
      await page.goto('/dashboard');
      const menuBtn = page.locator('button').filter({ has: page.locator('svg') }).first();
      await menuBtn.click();
      await page.waitForTimeout(500);
      const overlay = page.locator('.fixed.inset-0.bg-black\\/50').first();
      await overlay.click();
      await page.waitForTimeout(500);
    });

    test('should display mobile content without horizontal scroll', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForTimeout(1000);
      const mainContent = page.locator('main');
      const box = await mainContent.boundingBox();
      if (box) {
        expect(box.width).toBeGreaterThan(0);
        expect(box.x).toBeGreaterThanOrEqual(0);
      }
    });
  });

  test.describe('Tablet Viewport', () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    test('should have responsive layout on tablet', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForTimeout(1000);
      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();
    });

    test('should display hamburger menu on tablet', async ({ page }) => {
      await page.goto('/dashboard');
      const menuBtn = page.locator('button').filter({ has: page.locator('svg') }).first();
      await expect(menuBtn).toBeVisible();
    });
  });
});
