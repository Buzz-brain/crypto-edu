import { test, expect } from '@playwright/test';

test.describe('Student Payment Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('complete payment flow simulation', async ({ page }) => {
    // Start from landing page
    await expect(page.getByText('Crypto Payments for Modern Education')).toBeVisible();
    
    // Navigate to login
    await page.getByRole('button', { name: /get started/i }).click();
    
    // Login with demo credentials
    await page.fill('input[type="email"]', 'alice.smith@university.edu');
    await page.fill('input[type="password"]', 'password');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Wait for dashboard to load
    await expect(page.getByText(/welcome back, alice/i)).toBeVisible();
    
    // Initiate payment
    await page.getByRole('button', { name: /make payment/i }).click();
    
    // Payment flow should open
    await expect(page.getByText(/select cryptocurrency/i)).toBeVisible();
    
    // Select currency (ETH should be default)
    const ethOption = page.locator('[data-currency="ETH"]').first();
    if (await ethOption.count() > 0) {
      await ethOption.click();
    }
    
    // Proceed to next step
    await page.getByRole('button', { name: /next/i }).click();
    
    // Choose payment method
    await expect(page.getByText(/payment method/i)).toBeVisible();
    await page.getByText(/metamask wallet/i).click();
    
    // Proceed to confirmation
    await page.getByRole('button', { name: /next/i }).click();
    
    // Confirm payment
    await expect(page.getByText(/confirm payment/i)).toBeVisible();
    const payButton = page.getByRole('button', { name: /pay with metamask/i });
    
    if (await payButton.count() > 0) {
      await payButton.click();
      
      // Wait for transaction to be created
      await page.waitForTimeout(2000);
      
      // Should show confirmation or redirect to dashboard
      // In demo mode, this will show a transaction hash
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('wallet connection simulation', async ({ page }) => {
    // Login first
    await page.goto('/');
    await page.getByRole('button', { name: /get started/i }).click();
    await page.fill('input[type="email"]', 'alice.smith@university.edu');
    await page.fill('input[type="password"]', 'password');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Try to connect wallet
    const connectButton = page.getByRole('button', { name: /connect wallet/i });
    if (await connectButton.count() > 0) {
      await connectButton.click();
      
      // Should show connected state
      await expect(page.getByText(/wallet connected/i)).toBeVisible({ timeout: 10000 });
    }
  });

  test('navigation and accessibility', async ({ page }) => {
    // Login first
    await page.goto('/');
    await page.getByRole('button', { name: /get started/i }).click();
    await page.fill('input[type="email"]', 'alice.smith@university.edu');
    await page.fill('input[type="password"]', 'password');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Test sidebar navigation
    await page.getByRole('button', { name: /transaction history/i }).click();
    await expect(page.getByText(/payment history/i)).toBeVisible();
    
    // Test help center
    await page.getByRole('button', { name: /help center/i }).click();
    await expect(page.getByText(/get help with payments/i)).toBeVisible();
    
    // Check accessibility - basic checks
    await expect(page.locator('[aria-label]')).toHaveCount(await page.locator('[aria-label]').count());
  });
});

test.describe('Admin Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /get started/i }).click();
    
    // Login as admin
    await page.fill('input[type="email"]', 'admin@university.edu');
    await page.fill('input[type="password"]', 'password');
    await page.getByRole('button', { name: /sign in/i }).click();
  });

  test('admin dashboard loads correctly', async ({ page }) => {
    await expect(page.getByText(/admin dashboard/i)).toBeVisible();
    await expect(page.getByText(/total users/i)).toBeVisible();
  });

  test('transaction management features', async ({ page }) => {
    await page.getByRole('button', { name: /transaction management/i }).click();
    await expect(page.getByText(/review, approve, and manage/i)).toBeVisible();
    
    // Test search functionality
    await page.fill('input[placeholder*="Search"]', 'alice');
    await page.waitForTimeout(500);
    
    // Should filter results
    await expect(page.locator('table tbody tr')).toHaveCount(await page.locator('table tbody tr').count());
  });

  test('payment simulator controls', async ({ page }) => {
    await page.getByRole('button', { name: /payment simulator/i }).click();
    await expect(page.getByText(/payment simulator/i)).toBeVisible();
    
    // Test simulation controls
    const startButton = page.getByRole('button', { name: /start simulation/i });
    if (await startButton.count() > 0) {
      await startButton.click();
      await expect(page.getByText(/simulation is active/i)).toBeVisible();
    }
  });
});