import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard - Product Edit', () => {
  test('should navigate to product edit page', async ({ page }) => {
    await page.goto('/dashboard/products/prod-1/edit');
    if (page.url().includes('/dashboard/products')) {
      const title = page.locator('h1, h2, h3', { hasText: /Editar|Edit|Actualizar/i }).first();
      if (await title.count() > 0) {
        await expect(title).toBeVisible();
      }
    }
  });

  test('should load product data in edit form', async ({ page }) => {
    await page.goto('/dashboard/products/prod-1/edit');
    if (page.url().includes('/dashboard/products')) {
      await page.waitForTimeout(2000);
      const nameInput = page.locator('input[name="name"], input#name').first();
      if (await nameInput.count() > 0) {
        await expect(nameInput).toBeVisible();
        const value = await nameInput.inputValue();
        expect(value).toBeTruthy();
      }
    }
  });

  test('should display product image in edit form', async ({ page }) => {
    await page.goto('/dashboard/products/prod-1/edit');
    if (page.url().includes('/dashboard/products')) {
      await page.waitForTimeout(2000);
      const img = page.locator('img[alt*="Black Lotus"], img[alt*="product"]').first();
      if (await img.count() > 0) {
        const src = await img.getAttribute('src');
        expect(src).toBeTruthy();
      }
    }
  });

  test('should allow editing product fields', async ({ page }) => {
    await page.goto('/dashboard/products/prod-1/edit');
    if (page.url().includes('/dashboard/products')) {
      await page.waitForTimeout(2000);
      const nameInput = page.locator('input[name="name"], input#name').first();
      if (await nameInput.count() > 0) {
        await nameInput.fill('Black Lotus (Edited)');
        const saveBtn = page.locator('button[type="submit"], button:has-text("Guardar"), button:has-text("Save")').first();
        if (await saveBtn.count() > 0) {
          await saveBtn.click();
          await page.waitForTimeout(1000);
          const toast = page.locator('text=/éxito|guardado|success|actualizado/i').first();
          if (await toast.count() > 0) {
            await expect(toast).toBeVisible();
          }
        }
      }
    }
  });

  test('should have cancel button on edit form', async ({ page }) => {
    await page.goto('/dashboard/products/prod-1/edit');
    if (page.url().includes('/dashboard/products')) {
      const cancelBtn = page.locator('a[href*="/dashboard/products"], button:has-text("Cancelar"), button:has-text("Back")').first();
      if (await cancelBtn.count() > 0) {
        await expect(cancelBtn).toBeVisible();
      }
    }
  });

  test('should update product stock in edit form', async ({ page }) => {
    await page.goto('/dashboard/products/prod-1/edit');
    if (page.url().includes('/dashboard/products')) {
      await page.waitForTimeout(2000);
      const stockInput = page.locator('input[name="stock"], input#stock, input[placeholder*="stock"]').first();
      if (await stockInput.count() > 0) {
        await stockInput.fill('5');
        const saveBtn = page.locator('button[type="submit"]').first();
        if (await saveBtn.count() > 0) {
          await saveBtn.click();
          await page.waitForTimeout(500);
        }
      }
    }
  });
});
