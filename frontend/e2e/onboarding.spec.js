import { expect, test } from '@playwright/test';
test('guest can register and reach the authenticated route', async ({ page }) => {
  await page.goto('/register');
  await page.getByLabel('Display Name').fill('E2E Writer');
  await page.getByLabel('Username').fill('e2ewriter');
  await page.getByLabel('Password').fill('secret');
  await page.getByLabel('Confirm Password').fill('secret');
  await page.getByRole('button', { name: 'Create Account' }).click();
  await expect(page).toHaveURL(/\/blogs$/);
});
