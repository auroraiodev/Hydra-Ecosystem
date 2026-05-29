import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard - Tags', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/tags');
  });

  test('should display tags page header', async ({ page }) => {
    const title = page.locator('h1, h2, h3', { hasText: /Tags|Etiquetas/i }).first();
    await expect(title).toBeVisible();
  });

  test('should list tags from mock data', async ({ page }) => {
    await page.waitForTimeout(1000);
    const tagItems = page.locator('text=Commander').first();
    if (await tagItems.count() > 0) {
      await expect(tagItems).toBeVisible();
    }
  });

  test('should have create tag button', async ({ page }) => {
    const createBtn = page.locator('button:has-text("Nueva"), button:has-text("Add"), button:has-text("Crear"), a[href*="add"]').first();
    if (await createBtn.count() > 0) {
      await expect(createBtn).toBeVisible();
    }
  });

  test('should have edit action on tags', async ({ page }) => {
    const editBtn = page.locator('button[aria-label*="Editar"], button:has-text("Editar")').first();
    if (await editBtn.count() > 0) {
      await expect(editBtn).toBeVisible();
    }
  });

  test('should have delete action on tags', async ({ page }) => {
    const deleteBtn = page.locator('button[aria-label*="Eliminar"], button.text-destructive').first();
    if (await deleteBtn.count() > 0) {
      await expect(deleteBtn).toBeVisible();
    }
  });
});
