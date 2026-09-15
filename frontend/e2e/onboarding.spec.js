import { expect, test } from '@playwright/test';

let consoleErrors;
test.beforeEach(async ({ page }) => {
  consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('writespace-e2e-initialized')) {
      localStorage.clear();
      sessionStorage.setItem('writespace-e2e-initialized', 'true');
    }
  });
});

test.afterEach(async ({ page }) => {
  await page.screenshot({ path: `test-results/onboarding-${test.info().title.replace(/[^a-z0-9]+/gi, '-')}.png`, fullPage: true });
  expect(consoleErrors).toEqual([]);
});

test('registration validates reserved usernames, persists a unique account, and restores the session after reload', async ({ page }) => {
  const username = `writer-${Date.now()}`;
  await page.goto('/register');
  await page.getByLabel('Display Name').fill('E2E Writer');
  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password', { exact: true }).fill('secret');
  await page.getByLabel('Confirm Password').fill('secret');
  await page.getByRole('button', { name: 'Create Account' }).click();
  await expect(page.getByRole('alert')).toContainText('Username is already taken.');

  await page.getByLabel('Username').fill(username);
  await page.getByRole('button', { name: 'Create Account' }).click();
  await expect(page).toHaveURL(/\/blogs$/);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('writespace_users'))).toContain(username);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'All Blogs' })).toBeVisible();
});
