import { expect, test } from '@playwright/test';
test('default administrator can view metrics and manage a recent post', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByText('Total Posts')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Manage Users' })).toBeVisible();
});
