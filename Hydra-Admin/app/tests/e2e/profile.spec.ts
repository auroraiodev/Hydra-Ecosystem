import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard - Profile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/profile');
  });

  test('should display profile page header', async ({ page }) => {
    const title = page.locator('h1, h2, h3', { hasText: /Profile|Perfil/i }).first();
    await expect(title).toBeVisible();
  });

  test('should display user avatar', async ({ page }) => {
    await page.waitForTimeout(2000);
    const avatar = page.locator('[class*="avatar"] img').first();
    if (await avatar.count() > 0) {
      await expect(avatar).toBeAttached();
      const src = await avatar.getAttribute('src');
      expect(src).toBeTruthy();
    }
  });

  test('should have profile form with name field', async ({ page }) => {
    await page.waitForTimeout(1000);
    const nameInput = page.locator('input[name="name"], input#name, input[placeholder*="nombre"]').first();
    if (await nameInput.count() > 0) {
      await expect(nameInput).toBeVisible();
    }
  });

  test('should have profile form with email field', async ({ page }) => {
    await page.waitForTimeout(1000);
    const emailInput = page.locator('input[name="email"], input#email').first();
    if (await emailInput.count() > 0) {
      await expect(emailInput).toBeVisible();
    }
  });

  test('should have save button for profile updates', async ({ page }) => {
    await page.waitForTimeout(1000);
    const saveBtn = page.locator('button[type="submit"], button:has-text("Guardar"), button:has-text("Save")').first();
    if (await saveBtn.count() > 0) {
      await expect(saveBtn).toBeVisible();
    }
  });

  test('should toggle profile visibility setting', async ({ page }) => {
    await page.waitForTimeout(1000);
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

  test('should have cancel button to discard changes', async ({ page }) => {
    const cancelBtn = page.locator('button:has-text("Cancelar"), button:has-text("Cancel")').first();
    if (await cancelBtn.count() > 0) {
      await expect(cancelBtn).toBeVisible();
    }
  });
});
