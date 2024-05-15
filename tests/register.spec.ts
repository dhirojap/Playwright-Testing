import { test, expect, Page } from "@playwright/test";

export type UserDataType = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
};

const wrongUser: UserDataType = {
  email: "invalidemail",
  firstName: "123",
  lastName: "321",
  password: "invalidpass",
  confirmPassword: "invalidandwrongconfirmpass",
};

export const correctUser: UserDataType = {
  email: "newuser1@gmail.com",
  firstName: "new",
  lastName: "user",
  password: "#Pass123",
  confirmPassword: "#Pass123",
};

export async function register(page: Page, userData: UserDataType) {
  await page.locator("#register-email").fill(userData.email);
  await page.locator("#register-first-name").fill(userData.firstName);
  await page.locator("#register-last-name").fill(userData.lastName);
  await page.locator("#register-password").fill(userData.password);
  await page
    .locator("#register-confirm-password")
    .fill(userData.confirmPassword);
  await page.getByRole("button", { name: "Register", exact: true }).click();
}

test("registerFailed", async ({ page }) => {
  await page.goto("http://127.0.0.1:8000");
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Register", exact: true })
    .click();
  await register(page, wrongUser);

  await expect(page.getByText("Please enter a valid email")).toBeVisible();
  await expect(page.getByText("Your first name must be")).toBeVisible();
  await expect(page.getByText("Your last name must be")).toBeVisible();
  await expect(page.getByText("Password must contain at")).toBeVisible();
  await expect(page.getByText("Passwords do not match")).toBeVisible();
});

test("registerSuccess", async ({ page }) => {
  await page.goto("http://127.0.0.1:8000");
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Register", exact: true })
    .click();
  await register(page, correctUser);

  await expect(page.getByText("Account successfully created.")).toBeVisible();
});

test("registerExists", async ({ page }) => {
  await page.goto("http://127.0.0.1:8000");
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Register", exact: true })
    .click();
  await register(page, correctUser);

  await expect(page.getByText("Account successfully created.")).toBeVisible();

  await page.goto("http://127.0.0.1:8000");
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Register", exact: true })
    .click();
  await register(page, correctUser);

  await expect(
    page.getByText("This email has already been taken.")
  ).toBeVisible();
});
