import { expect, test } from '@playwright/test';
test('registered author can create, read, and remove a local post', async ({ page }) => {
  await page.goto('/register');
  await page.getByLabel('Display Name').fill('Blog Writer');
  await page.getByLabel('Username').fill('blogwriter');
  await page.getByLabel('Password').fill('secret');
  await page.getByLabel('Confirm Password').fill('secret');
  await page.getByRole('button', { name: 'Create Account' }).click();
  await page.getByRole('link', { name: 'Write' }).click();
  await page.getByLabel('Title').fill('My first local post');
  await page.getByLabel('Content').fill('This is content persisted in local storage.');
  await page.getByRole('button', { name: 'Save Post' }).click();
  await expect(page.getByRole('heading', { name: 'My first local post' })).toBeVisible();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByText(/no blogs yet/i)).toBeVisible();
});
