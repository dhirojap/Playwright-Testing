import { test, expect } from '@playwright/test';
import { register } from './utils';
import { correctUser } from './__mocks__/user';

test('loginFailed', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000');
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Login', exact: true })
    .click();
  await page.locator('#login-email').fill('invalidemail');
  await page.locator('#login-password').fill('invalidpass');
  await page.getByRole('button', { name: 'Login', exact: true }).click();

  await expect(page.getByText('Please enter a valid email')).toBeVisible();
  await expect(page.getByText('Password must contain at')).toBeVisible();
});

test('loginSuccess', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000');
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Register', exact: true })
    .click();
  await register(page, correctUser);

  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Login', exact: true })
    .click();
  await page.locator('#login-email').fill('newuser1@gmail.com');
  await page.locator('#login-password').fill('#Pass123');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.url()).toBe('http://127.0.0.1:8000/profile');
});

test('loginAccountNotFound', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000');
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Login', exact: true })
    .click();
  await page.locator('#login-email').fill('newuser1@gmail.com');
  await page.locator('#login-password').fill('#Pass123');
  await page.getByRole('button', { name: 'Login', exact: true }).click();

  await expect(
    page.getByText("Account doesn't exist! Please create a new one.")
  ).toBeVisible();
});

test('loginWrongPassword', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000');
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Register', exact: true })
    .click();
  await register(page, correctUser);

  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Login' })
    .click();
  await page.locator('#login-email').fill('newuser1@gmail.com');
  await page.locator('#login-password').fill('#Wrong123');
  await page.getByRole('button', { name: 'Login', exact: true }).click();

  await expect(page.getByText('Incorrect password!')).toBeVisible();
});

test('logoutSuccess', async ({ page }) => {
  await page.goto('http://127.0.0.1:8000');
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Register', exact: true })
    .click();
  await register(page, correctUser);

  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Login', exact: true })
    .click();
  await page.locator('#login-email').fill('newuser1@gmail.com');
  await page.locator('#login-password').fill('#Pass123');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.locator('#menu-button').click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();

  await expect(page.url()).toBe('http://127.0.0.1:8000/login');
});
