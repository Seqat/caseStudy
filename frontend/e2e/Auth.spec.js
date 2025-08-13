import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test("should register and login successfully", async ({ page }) => {
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = "password123";

    // Go to register page
    await page.goto("/register");

    // Fill registration form
    await page.fill('[data-testid="email-input"]', testEmail);
    await page.fill('[data-testid="password-input"]', testPassword);
    await page.fill('[data-testid="confirm-password-input"]', testPassword);

    // Submit registration
    await page.click('[data-testid="register-button"]');

    // Should redirect to dashboard after successful registration
    await expect(page).toHaveURL("/dashboard");
    await expect(page.locator('[data-testid="profile-info"]')).toBeVisible();

    // Logout
    await page.click('[data-testid="logout-button"]');

    // Should redirect to login
    await expect(page).toHaveURL("/login");

    // Login with the same credentials
    await page.fill('[data-testid="email-input"]', testEmail);
    await page.fill('[data-testid="password-input"]', testPassword);
    await page.click('[data-testid="login-button"]');

    // Should redirect to dashboard again
    await expect(page).toHaveURL("/dashboard");
    await expect(page.locator('[data-testid="profile-info"]')).toBeVisible();
  });

  test("should show error for invalid login", async ({ page }) => {
    await page.goto("/login");

    // Try to login with invalid credentials
    await page.fill('[data-testid="email-input"]', "invalid@example.com");
    await page.fill('[data-testid="password-input"]', "wrongpassword");
    await page.click('[data-testid="login-button"]');

    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();

    // Should stay on login page
    await expect(page).toHaveURL("/login");
  });

  test("should protect dashboard route", async ({ page }) => {
    // Try to access dashboard without login
    await page.goto("/dashboard");

    // Should redirect to login
    await expect(page).toHaveURL("/login");
  });
});
