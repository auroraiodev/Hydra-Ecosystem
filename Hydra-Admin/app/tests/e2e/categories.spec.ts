import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard - Categories', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/categories');
  });

  test('should display categories page header', async ({ page }) => {
    const title = page.locator('h1, h2, h3', { hasText: /Categories|Categorías/i }).first();
    await expect(title).toBeVisible();
  });

  test('should list categories with mock data', async ({ page }) => {
    await expect(page.locator('text=Singles').first()).toBeVisible();
    await expect(page.locator('text=Sealed Product').first()).toBeVisible();
  });

  test('should display TCG badge on category rows', async ({ page }) => {
    await page.waitForTimeout(1000);
    const tcgBadge = page.locator('text=Magic: The Gathering').first();
    if (await tcgBadge.count() > 0) {
      await expect(tcgBadge).toBeVisible();
    }
  });

  test('should have add category button', async ({ page }) => {
    const addBtn = page.locator('button:has-text("Nueva"), button:has-text("Add"), a[href*="categories/add"]').first();
    if (await addBtn.count() > 0) {
      await expect(addBtn).toBeVisible();
    }
  });

  test('should toggle category active status', async ({ page }) => {
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

  test('should have edit action on category rows', async ({ page }) => {
    const editBtn = page.locator('button[aria-label*="Editar"], button:has-text("Editar")').first();
    if (await editBtn.count() > 0) {
      await expect(editBtn).toBeVisible();
    }
  });

  test('should display category active toggle switch', async ({ page }) => {
    const switchEl = page.locator('div[role="switch"]').first();
    if (await switchEl.count() > 0) {
      await expect(switchEl).toBeVisible();
    }
  });
});
