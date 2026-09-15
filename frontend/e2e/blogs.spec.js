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
  await page.screenshot({ path: `test-results/blogs-${test.info().title.replace(/[^a-z0-9]+/gi, '-')}.png`, fullPage: true });
  expect(consoleErrors).toEqual([]);
});

test('registered author can create, edit, reload, and remove a local post', async ({ page }) => {
  const username = `blogwriter-${Date.now()}`;
  await page.goto('/register');
  await page.getByLabel('Display Name').fill('Blog Writer');
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Password', { exact: true }).fill('secret');
  await page.getByLabel('Confirm Password').fill('secret');
  await page.getByRole('button', { name: 'Create Account' }).click();
  await page.getByRole('navigation', { name: 'Authenticated navigation' }).getByRole('link', { name: 'Write', exact: true }).click();
  await page.getByLabel('Title').fill('My first local post');
  await page.getByLabel('Content').fill('This is content persisted in local storage.');
  await page.getByRole('button', { name: 'Save Post' }).click();
  await expect(page.getByRole('heading', { name: 'My first local post' })).toBeVisible();

  await page.getByRole('link', { name: 'Edit' }).click();
  await page.getByLabel('Title').fill('My updated local post');
  await page.getByRole('button', { name: 'Save Post' }).click();
  await expect(page.getByRole('heading', { name: 'My updated local post' })).toBeVisible();
  await page.reload();
  await expect(page.getByText('This is content persisted in local storage.')).toBeVisible();

  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByText(/no blogs yet/i)).toBeVisible();
});
