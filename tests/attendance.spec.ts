import { test, Page, expect } from '@playwright/test';
import { correctUser } from './__mocks__/user';
import { register } from './utils';

async function goToAttendance(page: Page) {
  await page.goto('http://127.0.0.1:8000');

  await page.locator('#login-email').fill('update@gmail.com');
  await page.locator('#login-password').fill('#Pass321');
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  await page.locator('#menu-button').click();
  await page.getByRole('menuitem', { name: 'Attendance', exact: true }).click();
}

test('takeAttendanceNoSchedule', async ({ page }) => {
  await goToAttendance(page);

  await expect(
    page.getByText(
      'You must input your schedule first before taking attendance!'
    )
  ).toBeVisible();
});

test('inputScheduleInvalid', async ({ page }) => {
  await goToAttendance(page);

  await page
    .getByRole('button', { name: 'Input Schedule', exact: true })
    .click();
  await page
    .getByRole('row', { name: 'Monday 00:00 - 00:00 (0hr 0m)' })
    .locator('#set-schedule-button')
    .click();
  await page.locator('#time-start').fill('20:00');
  await page.locator('#time-end').fill('08:00');
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();

  await expect(
    page.getByText('Invalid input! Start time must be earlier than end time.')
  ).toBeVisible();
});

test('inputScheduleSuccess', async ({ page }) => {
  const DAYS = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ] as const;

  await goToAttendance(page);

  await page
    .getByRole('button', { name: 'Input Schedule', exact: true })
    .click();
  for (const day of DAYS) {
    await page
      .getByRole('row', { name: `${day} 00:00 - 00:00 (0hr 0m)` })
      .locator('#set-schedule-button')
      .click();
    await page.locator('#time-start').fill('10:00');
    await page.locator('#time-end').fill('18:00');
    await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  }

  await page
    .getByRole('button', { name: 'Save Schedule', exact: true })
    .click();
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();

  await expect(page.getByText('Schedule input successfully!')).toBeVisible();
  await expect(
    page.getByText(
      'You must input your schedule first before taking attendance!'
    )
  ).toBeHidden();
  await expect(
    page.getByRole('button', { name: 'Check In', exact: true })
  ).toBeVisible();

  await page
    .getByRole('button', { name: 'Input Schedule', exact: true })
    .click();

  await expect(
    page.getByRole('button', { name: 'Save Schedule', exact: true })
  ).toBeHidden();
});

test('takeAttendanceSuccess', async ({ page }) => {
  await goToAttendance(page);

  await expect(
    page.getByText(
      'You must input your schedule first before taking attendance!'
    )
  ).toBeHidden();
  await expect(
    page.getByRole('button', { name: 'Check In', exact: true })
  ).toBeVisible();

  await page.getByRole('button', { name: 'Check In', exact: true }).click();
  const checkInTime = new Date();
  const OPTIONS = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  } as const;
  const formattedTime = checkInTime.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });
  const formatDate = new Intl.DateTimeFormat('en-US', OPTIONS);
  const parts = formatDate.formatToParts(checkInTime);

  //const values = parts.map((p) => p.value);
  //0 = Wednesday
  //1 = empty
  //2 = May
  //3 = empty
  //4 = 15
  //5 = empty
  //6 = 2024

  await expect(page.getByText('Successfully checked in!')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Check In', exact: true })
  ).toBeHidden();

  await page.getByRole('button', { name: 'Report', exact: true }).click();

  await expect(
    page.getByRole('cell', { name: `${formattedTime}` }).first()
  ).toBeVisible();

  await expect(
    page
      .getByRole('cell', {
        name: `${parts[0].value}, ${parts[4].value} ${parts[2].value} ${parts[6].value}`,
        exact: true,
      })
      .first()
  ).toBeVisible();
  await expect(
    page.getByRole('cell', { name: 'Not checked out' }).first()
  ).toBeVisible();
  await expect(page.getByRole('cell', { name: 'NULL' }).first()).toBeVisible();

  await page
    .getByRole('button', { name: 'Take Attendance', exact: true })
    .click();

  await expect(
    page.getByRole('button', { name: 'Check Out', exact: true })
  ).toBeVisible();

  await page.getByRole('button', { name: 'Check Out', exact: true }).click();

  await expect(page.getByText('Please wait at least 30 minutes')).toBeVisible();
});
