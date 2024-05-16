import { Page } from '@playwright/test';
import { UserDataType } from './types';

export async function register(page: Page, userData: UserDataType) {
  await page.locator('#register-email').fill(userData.email);
  await page.locator('#register-first-name').fill(userData.firstName);
  await page.locator('#register-last-name').fill(userData.lastName);
  await page.locator('#register-password').fill(userData.password);
  await page
    .locator('#register-confirm-password')
    .fill(userData.confirmPassword);
  await page.getByRole('button', { name: 'Register', exact: true }).click();
}
