import { test, expect, Page } from '@playwright/test';
import { register } from './utils';
import { correctUser, wrongUser } from './__mocks__/user';

test('registerFailed', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000');
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Register', exact: true })
    .click();
  await register(page, wrongUser);

  await expect(page.getByText('Please enter a valid email')).toBeVisible();
  await expect(page.getByText('Your first name must be')).toBeVisible();
  await expect(page.getByText('Your last name must be')).toBeVisible();
  await expect(page.getByText('Password must contain at')).toBeVisible();
  await expect(page.getByText('Passwords do not match')).toBeVisible();
});

test('registerSuccess', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000');
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Register', exact: true })
    .click();
  await register(page, correctUser);

  await expect(page.getByText('Account successfully created.')).toBeVisible();
});

test('registerExists', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000');
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Register', exact: true })
    .click();
  await register(page, correctUser);

  await expect(page.getByText('Account successfully created.')).toBeVisible();

  await page.goto('http://127.0.0.1:8000');
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Register', exact: true })
    .click();
  await register(page, correctUser);

  await expect(
    page.getByText('This email has already been taken.')
  ).toBeVisible();
});
