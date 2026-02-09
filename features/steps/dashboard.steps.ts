import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, Then } = createBdd();

Given('I am on the dashboard page', async ({ page }) => {
  await page.goto('/');
});

Then('I should see the net worth displayed', async ({ page }) => {
  await expect(page.getByTestId('net-worth-card')).toBeVisible();
});

Then('I should see the breakdown by category', async ({ page }) => {
  await expect(page.getByTestId('category-cash')).toBeVisible();
  await expect(page.getByTestId('category-assets')).toBeVisible();
  await expect(page.getByTestId('category-debts')).toBeVisible();
});
