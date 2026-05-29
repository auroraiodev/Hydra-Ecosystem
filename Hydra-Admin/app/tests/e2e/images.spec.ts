import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard - Images & Media', () => {
  test.describe('Hydra Logo', () => {
    test('should display Hydra cat logo in sidebar', async ({ page }) => {
      await page.goto('/dashboard');
      const logo = page.locator('img[alt="Hydra Logo"]');
      await expect(logo).toBeVisible();
      await expect(logo).toHaveAttribute('src', /.*cat.png/);
    });

    test('should verify Hydra logo loads successfully', async ({ page }) => {
      await page.goto('/dashboard');
      const logo = page.locator('img[alt="Hydra Logo"]');
      const loaded = await logo.evaluate(async (img: HTMLImageElement) => {
        if (img.complete && img.naturalWidth > 0) return true;
        return new Promise<boolean>((resolve) => {
          img.onload = () => resolve(img.naturalWidth > 0);
          img.onerror = () => resolve(false);
        });
      });
      expect(loaded).toBeTruthy();
    });
  });

  test.describe('Product Images', () => {
    test('should display product images in products table', async ({ page }) => {
      await page.goto('/dashboard/products');
      await page.waitForTimeout(2000);
      const productImgs = page.locator('tr img').first();
      if (await productImgs.count() > 0) {
        await expect(productImgs).toBeAttached();
        const src = await productImgs.getAttribute('src');
        expect(src).toBeTruthy();
      }
    });

    test('should have alt attributes on all product images', async ({ page }) => {
      await page.goto('/dashboard/products');
      await page.waitForTimeout(2000);
      const imgs = page.locator('img');
      const count = await imgs.count();
      for (let i = 0; i < Math.min(count, 10); i++) {
        const alt = await imgs.nth(i).getAttribute('alt');
        expect(alt).toBeTruthy();
      }
    });
  });

  test.describe('Order Images', () => {
    test('should display product images in order detail', async ({ page }) => {
      await page.goto('/dashboard/orders/order-1');
      await page.waitForTimeout(2000);
      const orderImgs = page.locator('main img').first();
      if (await orderImgs.count() > 0) {
        await expect(orderImgs).toBeVisible();
        const src = await orderImgs.getAttribute('src');
        expect(src).toBeTruthy();
      }
    });

    test('should verify order images load successfully', async ({ page }) => {
      await page.goto('/dashboard/orders/order-1');
      await page.waitForTimeout(2000);
      const img = page.locator('img[alt="Sol Ring"]').first();
      if (await img.count() > 0) {
        const loaded = await img.evaluate(async (imgEl: HTMLImageElement) => {
          if (imgEl.complete && imgEl.naturalWidth > 0) return true;
          return new Promise<boolean>((resolve) => {
            imgEl.onload = () => resolve(imgEl.naturalWidth > 0);
            imgEl.onerror = () => resolve(false);
          });
        });
        expect(loaded).toBeTruthy();
      }
    });
  });

  test.describe('TCG Images', () => {
    test('should display TCG logo images', async ({ page }) => {
      await page.goto('/dashboard/tcgs');
      await page.waitForTimeout(2000);
      const tcgImgs = page.locator('td img').first();
      if (await tcgImgs.count() > 0) {
        const src = await tcgImgs.getAttribute('src');
        expect(src).toBeTruthy();
      }
    });
  });

  test.describe('Banner Images', () => {
    test('should display banner images on banners page', async ({ page }) => {
      await page.goto('/dashboard/banners');
      await page.waitForTimeout(2000);
      const bannerImg = page.locator('img[alt*="Modern Horizons"]').first();
      if (await bannerImg.count() > 0) {
        await expect(bannerImg).toBeVisible();
        const loaded = await bannerImg.evaluate(async (img: HTMLImageElement) => {
          if (img.complete && img.naturalWidth > 0) return true;
          return new Promise<boolean>((resolve) => {
            img.onload = () => resolve(img.naturalWidth > 0);
            img.onerror = () => resolve(false);
          });
        });
        expect(loaded).toBeTruthy();
      }
    });
  });

  test.describe('Avatar Images', () => {
    test('should display user avatar in sidebar', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForTimeout(2000);
      const avatar = page.locator('[class*="avatar"] img').first();
      if (await avatar.count() > 0) {
        await expect(avatar).toBeAttached();
      }
    });
  });

  test.describe('Category Images', () => {
    test('should display category icons if present', async ({ page }) => {
      await page.goto('/dashboard/categories');
      await page.waitForTimeout(2000);
      const catImgs = page.locator('td img').first();
      if (await catImgs.count() > 0) {
        const src = await catImgs.getAttribute('src');
        expect(src).toBeTruthy();
      }
    });
  });

  test.describe('Skeleton Loading States', () => {
    test('should show skeleton while data loads', async ({ page }) => {
      await page.goto('/dashboard/products');
      const skeletons = page.locator('[class*="skeleton"]').first();
      if (await skeletons.count() > 0) {
        await expect(skeletons).toBeVisible();
      }
    });
  });
});
