import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Then, When } = createBdd();

Then(
  'I should see the {string} category table with its total',
  async ({ page }, category: string) => {
    const testIdMap: Record<string, string> = {
      Cash: 'category-table-cash',
      Assets: 'category-table-asset',
      Debts: 'category-table-debt',
    };
    const table = page.getByTestId(testIdMap[category]);
    await expect(table).toBeVisible();
    const heading = table.locator('[data-testid="category-heading"]');
    await expect(heading).toContainText(category);
    await expect(heading).toContainText('$');
  }
);

Then('each category table should show accounts sorted by balance descending', async ({ page }) => {
  for (const testId of ['category-table-cash', 'category-table-asset', 'category-table-debt']) {
    const table = page.getByTestId(testId);
    const balanceCells = table.locator('[data-testid="balance-cell"]');
    const count = await balanceCells.count();
    if (count < 2) continue;

    const values: number[] = [];
    for (let i = 0; i < count; i++) {
      const text = await balanceCells.nth(i).textContent();
      const num = parseFloat(text!.replace(/[^0-9.-]/g, ''));
      values.push(num);
    }

    for (let i = 0; i < values.length - 1; i++) {
      expect(values[i]).toBeGreaterThanOrEqual(values[i + 1]);
    }
  }
});

When(
  'I click the {string} column header in the {string} table',
  async ({ page }, column: string, category: string) => {
    const testIdMap: Record<string, string> = {
      Cash: 'category-table-cash',
      Assets: 'category-table-asset',
      Debts: 'category-table-debt',
    };
    const table = page.getByTestId(testIdMap[category]);
    await table.getByRole('button', { name: new RegExp(column) }).click();
  }
);

Then('the {string} table should be sorted by name', async ({ page }, category: string) => {
  const testIdMap: Record<string, string> = {
    Cash: 'category-table-cash',
    Assets: 'category-table-asset',
    Debts: 'category-table-debt',
  };
  const table = page.getByTestId(testIdMap[category]);
  const nameCells = table.locator('[data-testid="name-cell"]');
  const count = await nameCells.count();

  const names: string[] = [];
  for (let i = 0; i < count; i++) {
    names.push((await nameCells.nth(i).textContent())!);
  }

  const sorted = [...names].sort((a, b) => a.localeCompare(b));
  expect(names).toEqual(sorted);
});
