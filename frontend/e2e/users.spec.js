import { expect, test } from '@playwright/test';
test('administrator can create a role-assigned local account while default admin stays protected', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.goto('/users');
  await page.getByLabel('Display Name').fill('Managed User');
  await page.getByLabel('Username').fill('managed');
  await page.getByLabel('Password').fill('secret');
  await page.getByLabel('Role').selectOption('user');
  await page.getByRole('button', { name: 'Create User' }).click();
  await expect(page.getByText('Managed User')).toBeVisible();
  await expect(page.getByTitle('Default admin cannot be deleted')).toBeVisible();
});
