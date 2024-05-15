import test, { Page, expect } from "@playwright/test";
import { correctUser, register } from "./register.spec";

async function goToProfile(page: Page) {
  await page.goto("http://127.0.0.1:8000");
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Register", exact: true })
    .click();
  await register(page, correctUser);

  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Login", exact: true })
    .click();
  await page.locator("#login-email").fill("newuser1@gmail.com");
  await page.locator("#login-password").fill("#Pass123");
  await page.getByRole("button", { name: "Login" }).click();
}

test("editUsernameSuccess", async ({ page }) => {
  await goToProfile(page);

  await page.getByPlaceholder("newuser", { exact: true }).fill("newuser1");
  await page.getByRole("button", { name: "Update", exact: true }).click();
  await expect(page.getByText("Profile updated successfully!")).toBeVisible();
  await expect(
    page.getByPlaceholder("newuser1", { exact: true })
  ).toBeVisible();
});

test("editUsernameExists", async ({ page }) => {
  await goToProfile(page);

  await page.getByPlaceholder("newuser", { exact: true }).fill("newuser");
  await page.getByRole("button", { name: "Update", exact: true }).click();

  await expect(page.getByText("This username has already")).toBeVisible();
});

test("editUsernameFailed", async ({ page }) => {
  await goToProfile(page);

  await page.getByPlaceholder("newuser", { exact: true }).fill("new  user ##");
  await page.getByRole("button", { name: "Update", exact: true }).click();

  await expect(page.getByText("Your username must not")).toBeVisible();
});

test("editEmailSuccess", async ({ page }) => {
  await goToProfile(page);

  await page
    .getByPlaceholder("newuser1@gmail.com", { exact: true })
    .fill("update@gmail.com");
  await page.getByRole("button", { name: "Update", exact: true }).click();

  await expect(page.getByText("Profile updated successfully!")).toBeVisible();
  await expect(
    page.getByPlaceholder("update@gmail.com", { exact: true })
  ).toBeVisible();
});

test("editEmailExists", async ({ page }) => {
  await goToProfile(page);

  await page
    .getByPlaceholder("newuser1@gmail.com", { exact: true })
    .fill("newuser1@gmail.com");
  await page.getByRole("button", { name: "Update", exact: true }).click();

  await expect(page.getByText("This email has already")).toBeVisible();
});

test("editEmailFailed", async ({ page }) => {
  await goToProfile(page);

  await page
    .getByPlaceholder("newuser1@gmail.com", { exact: true })
    .fill("newuser");
  await page.getByRole("button", { name: "Update", exact: true }).click();

  await expect(page.getByText("Please enter a valid email")).toBeVisible();
});

test("editFirstNameSuccess", async ({ page }) => {
  await goToProfile(page);

  await page.getByPlaceholder("new", { exact: true }).fill("updatefname");
  await page.getByRole("button", { name: "Update", exact: true }).click();

  await expect(page.getByText("Profile updated successfully!")).toBeVisible();
  await expect(
    page.getByPlaceholder("updatefname", { exact: true })
  ).toBeVisible();
});

test("editFirstNameFailed", async ({ page }) => {
  await goToProfile(page);

  await page.getByPlaceholder("new", { exact: true }).fill("123");
  await page.getByRole("button", { name: "Update", exact: true }).click();

  await expect(
    page.getByText("Your first name must be alphabetic")
  ).toBeVisible();
});

test("editLastNameSuccess", async ({ page }) => {
  await goToProfile(page);

  await page.getByPlaceholder("user", { exact: true }).fill("updatelname");
  await page.getByRole("button", { name: "Update", exact: true }).click();

  await expect(page.getByText("Profile updated successfully!")).toBeVisible();
  await expect(
    page.getByPlaceholder("updatelname", { exact: true })
  ).toBeVisible();
});

test("editLastNameFailed", async ({ page }) => {
  await goToProfile(page);

  await page.getByPlaceholder("user", { exact: true }).fill("456");
  await page.getByRole("button", { name: "Update", exact: true }).click();

  await expect(
    page.getByText("Your last name must be alphabetic")
  ).toBeVisible();
});

test("editAvatarSuccess", async ({ page }) => {
  await goToProfile(page);

  await page
    .getByLabel("Avatar", { exact: true })
    .setInputFiles("./assets/avatar.jpg");
  await page.getByRole("button", { name: "Update", exact: true }).click();

  await expect(page.getByText("Profile updated successfully!")).toBeVisible();
});

test("editAvatarFailed", async ({ page }) => {
  await goToProfile(page);

  await page
    .getByLabel("Avatar", { exact: true })
    .setInputFiles("./assets/invalidfile.docx");
  await page.getByRole("button", { name: "Update", exact: true }).click();

  await expect(
    page.getByText(
      "Please choose a file with .jpg, .jpeg, or .png extension only"
    )
  ).toBeVisible();
});

test("editPasswordSuccess", async ({ page }) => {
  await goToProfile(page);

  await page
    .getByRole("button", { name: "Change Password", exact: true })
    .click();
  await page.getByLabel("Password").fill("#Pass321");
  await page.getByRole("button", { name: "Update", exact: true }).click();
  await page.locator("#confirm-change-password").fill("#Pass123");
  await page.getByRole("button", { name: "Submit", exact: true }).click();

  await expect(page.getByText("Password changed successfully!")).toBeVisible();
});

test("editPasswordSame", async ({ page }) => {
  await goToProfile(page);

  await page
    .getByRole("button", { name: "Change Password", exact: true })
    .click();
  await page.getByLabel("Password").fill("#Pass123");
  await page.getByRole("button", { name: "Update", exact: true }).click();
  await page.locator("#confirm-change-password").fill("#Pass123");
  await page.getByRole("button", { name: "Submit", exact: true }).click();

  await expect(page.getByText("The new password must be")).toBeVisible();
});

test("editPasswordWrong", async ({ page }) => {
  await goToProfile(page);

  await page
    .getByRole("button", { name: "Change Password", exact: true })
    .click();
  await page.getByLabel("Password").fill("#Pass456");
  await page.getByRole("button", { name: "Update", exact: true }).click();
  await page.locator("#confirm-change-password").fill("#Pass456");
  await page.getByRole("button", { name: "Submit", exact: true }).click();

  await expect(page.getByText("Incorrect Password!")).toBeVisible();
});

test("editPasswordFailed", async ({ page }) => {
  await goToProfile(page);

  await page
    .getByRole("button", { name: "Change Password", exact: true })
    .click();
  await page.getByLabel("Password").fill("wfw");
  await page.getByRole("button", { name: "Update", exact: true }).click();

  await expect(page.getByText("Password must contain at least")).toBeVisible();
});

test("editPasswordVerifyFailed", async ({ page }) => {
  await goToProfile(page);

  await page
    .getByRole("button", { name: "Change Password", exact: true })
    .click();
  await page.getByLabel("Password").fill("#Pass123");
  await page.getByRole("button", { name: "Update", exact: true }).click();
  await page.locator("#confirm-change-password").fill("wfw");
  await page.getByRole("button", { name: "Submit", exact: true }).click();

  await expect(page.getByText("Password must contain at least")).toBeVisible();
});
