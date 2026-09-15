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
  await page.screenshot({ path: `test-results/admin-dashboard-${test.info().title.replace(/[^a-z0-9]+/gi, '-')}.png`, fullPage: true });
  expect(consoleErrors).toEqual([]);
});

test('default administrator can view metrics and use dashboard confirmation branches', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByText('Total Posts')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Manage Users' })).toBeVisible();

  await page.addInitScript(() => {
    localStorage.setItem('writespace_posts', JSON.stringify([{ id: 'dashboard-post', title: 'Dashboard post', authorName: 'Writer', createdAt: '2025-01-01T00:00:00.000Z' }]));
  });
  await page.reload();
  page.once('dialog', (dialog) => dialog.dismiss());
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByText('Dashboard post')).toBeVisible();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByText('No posts to manage yet.')).toBeVisible();
});
