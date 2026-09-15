import { expect, test } from '@playwright/test';

let consoleErrors;
test.beforeEach(async ({ page }) => {
  consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  await page.addInitScript(() => localStorage.clear());
});

test.afterEach(async ({ page }) => {
  await page.screenshot({ path: `test-results/users-${test.info().title.replace(/[^a-z0-9]+/gi, '-')}.png`, fullPage: true });
  expect(consoleErrors).toEqual([]);
});

test('administrator opens user management from the dashboard and creates a role-assigned local account', async ({ page }) => {
  const username = `managed-${Date.now()}`;
  await page.goto('/login');
  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Manage Users' }).click();
  await expect(page).toHaveURL(/\/users$/);
  await page.getByLabel('Display Name').fill('Managed User');
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Password').fill('secret');
  await page.getByLabel('Role').selectOption('user');
  await page.getByRole('button', { name: 'Create User' }).click();
  await expect(page.getByText('Managed User')).toBeVisible();
  await expect(page.getByTitle('Default admin cannot be deleted')).toBeVisible();
});

test('administrator can open and close the mobile navigation menu', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.setViewportSize({ width: 375, height: 667 });
  const menu = page.locator('nav > div').last();
  await expect(menu).toHaveClass(/hidden/);
  await page.getByRole('button', { name: 'Toggle navigation' }).click();
  await expect(menu).toHaveClass(/flex/);
});
