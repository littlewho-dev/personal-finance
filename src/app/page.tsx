import { NetWorthCard } from '@/components/dashboard/net-worth-card';
import { CategoryTable } from '@/components/dashboard/category-table';
import {
  getAccounts,
  getAccountsWithBalances,
  getLatestSnapshot,
  getSettings,
  calculateNetWorth,
} from '@/lib/data';
import { messages } from '@/lib/i18n/messages';

export default function Dashboard() {
  const accounts = getAccounts();
  const snapshot = getLatestSnapshot();
  const settings = getSettings();

  if (!snapshot) {
    return (
      <main className="min-h-screen bg-background p-8">
        <p className="text-muted-foreground">{messages.common.noData}</p>
      </main>
    );
  }

  const breakdown = calculateNetWorth(snapshot, accounts);
  const allWithBalances = getAccountsWithBalances(snapshot, accounts);
  const cashAccounts = allWithBalances.filter((a) => a.type === 'cash');
  const assetAccounts = allWithBalances.filter((a) => a.type === 'asset');
  const debtAccounts = allWithBalances.filter((a) => a.type === 'debt');

  return (
    <main className="min-h-screen bg-background p-8">
      <h1 className="mb-8 text-3xl font-bold text-foreground">{messages.dashboard.title}</h1>
      <div className="max-w-md">
        <NetWorthCard
          breakdown={breakdown}
          currency={settings.currency}
          snapshotDate={snapshot.date}
        />
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <CategoryTable
          accounts={cashAccounts}
          categoryLabel={messages.categories.cash}
          categoryTotal={breakdown.cash}
          currency={settings.currency}
          testId="category-table-cash"
        />
        <CategoryTable
          accounts={assetAccounts}
          categoryLabel={messages.categories.asset}
          categoryTotal={breakdown.assets}
          currency={settings.currency}
          testId="category-table-asset"
        />
        <CategoryTable
          accounts={debtAccounts}
          categoryLabel={messages.categories.debt}
          categoryTotal={breakdown.debts}
          currency={settings.currency}
          testId="category-table-debt"
        />
      </div>
    </main>
  );
}
