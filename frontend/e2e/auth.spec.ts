import { test, expect } from '@playwright/test';

test.describe('User Authentication Flow', () => {
  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  test('should complete signup flow', async ({ page }) => {
    await page.goto('/signup');
    
    // Fill signup form
    await page.fill('[name="name"]', 'Test User');
    await page.fill('[name="email"]', testEmail);
    await page.fill('[name="password"]', testPassword);
    await page.fill('[name="confirmPassword"]', testPassword);
    
    // Check terms
    await page.check('[name="terms"]');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Should see success message (matches Signup.tsx)
    await expect(page.locator('h2')).toContainText('Registration Successful!');
    
    // Navigation to login
    await page.click('text=Go to Login');
    await expect(page).toHaveURL(/.*login/);
  });
  
  test('should complete login flow', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[name="email"]', testEmail);
    await page.fill('[name="password"]', testPassword);
    await page.click('button[type="submit"]');
    
    // Should redirect to home/dashboard
    // App.tsx has <Route path="/" element={<Home />} /> 
    // and Header.tsx redirects to /dashboard for dashboard button.
    // Login.tsx navigates to '/'
    await expect(page).toHaveURL(/\/$/);
  });
  
  test('should create new prompt', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('[name="email"]', testEmail);
    await page.fill('[name="password"]', testPassword);
    await page.click('button[type="submit"]');
    
    // Navigate to create page (from dashboard or direct)
    await page.goto('/prompts/new');
    
    // Fill form
    await page.fill('[name="title"]', 'Test Prompt');
    await page.fill('[name="description"]', 'This is a test prompt description');
    await page.selectOption('[name="status"]', 'active');
    await page.fill('[name="tags"]', 'test, playwright, e2e');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Should see success message (toast)
    // react-hot-toast uses generic containers, we can check for text
    await expect(page.getByText('Prompt created successfully')).toBeVisible();
    
    // Should redirect to prompts list
    await expect(page).toHaveURL(/.*prompts/);
    
    // Should appear in list
    await expect(page.getByText('Test Prompt')).toBeVisible();
  });
});
