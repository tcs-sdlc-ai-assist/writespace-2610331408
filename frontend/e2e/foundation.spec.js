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
  await page.screenshot({ path: `test-results/foundation-${test.info().title.replace(/[^a-z0-9]+/gi, '-')}.png`, fullPage: true });
  expect(consoleErrors).toEqual([]);
});

test('public WriteSpace shell renders its brand and primary discovery action', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /your thoughts/i })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Get Started Free', exact: true })).toBeVisible();
});

test('guest reaches the registration flow through visible public navigation', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Get Started Free', exact: true }).click();
  await expect(page).toHaveURL(/\/register$/);
});

// Direct entry is intentional: guests must be redirected when opening bookmarked protected URLs.
test('guest is redirected to login from a directly entered blogs URL', async ({ page }) => {
  await page.goto('/blogs');
  await expect(page).toHaveURL(/\/login$/);
});

// Direct entry is intentional: the PRD requires protection against bookmarked admin URLs.
// The normal-user session is seeded before this test's initial navigation to /admin.
test('normal user is rejected from a directly entered administrator URL and sees no admin navigation', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('writespace_session', JSON.stringify({ userId: 'writer-1', displayName: 'Writer', role: 'user' }));
  });
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/blogs$/);
  await expect(page.getByRole('link', { name: /admin/i })).toHaveCount(0);
});

// Direct entry is intentional: the PRD requires protection against bookmarked user-management URLs.
// The normal-user session is seeded before this test's initial navigation to /users.
test('normal user is rejected from a directly entered user-management URL', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('writespace_session', JSON.stringify({ userId: 'writer-1', displayName: 'Writer', role: 'user' }));
  });
  await page.goto('/users');
  await expect(page).toHaveURL(/\/blogs$/);
});
