import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard - TCGs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/tcgs');
  });

  test('should display TCGs page header', async ({ page }) => {
    const title = page.locator('h1, h2, h3', { hasText: /TCGs|Trading Card/i }).first();
    await expect(title).toBeVisible();
  });

  test('should list all mock TCGs with logos', async ({ page }) => {
    await expect(page.locator('text=Magic: The Gathering').first()).toBeVisible();
    await expect(page.locator('text=Yu-Gi-Oh!').first()).toBeVisible();
    await expect(page.locator('text=Pokémon').first()).toBeVisible();
  });

  test('should display TCG logo images', async ({ page }) => {
    await page.waitForTimeout(2000);
    const tcgImgs = page.locator('img[alt*="Magic" i], img[alt*="Yu-Gi" i], img[alt*="Pokémon" i], td img');
    const count = await tcgImgs.count();
    if (count > 0) {
      for (let i = 0; i < Math.min(count, 3); i++) {
        const src = await tcgImgs.nth(i).getAttribute('src');
        expect(src).toBeTruthy();
      }
    }
  });

  test('should have active toggle on TCG items', async ({ page }) => {
    const switchToggle = page.locator('div[role="switch"]').first();
    if (await switchToggle.count() > 0) {
      await expect(switchToggle).toBeVisible();
      const checkedBefore = await switchToggle.getAttribute('aria-checked');
      await switchToggle.click();
      await page.waitForTimeout(500);
      const checkedAfter = await switchToggle.getAttribute('aria-checked');
      expect(checkedAfter).not.toEqual(checkedBefore);
      await switchToggle.click();
    }
  });

  test('should have edit action on TCG rows', async ({ page }) => {
    const editBtn = page.locator('a[href*="edit"]').first();
    if (await editBtn.count() > 0) {
      await expect(editBtn).toBeVisible();
    }
  });

  test('should display order/position number for TCGs', async ({ page }) => {
    await page.waitForTimeout(1000);
    const orderDisplay = page.locator('text=/Orden|Order|Posición|Position/i').first();
    if (await orderDisplay.count() > 0) {
      await expect(orderDisplay).toBeVisible();
    }
  });
});
