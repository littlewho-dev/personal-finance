import { NetWorthCard } from '@/components/dashboard/net-worth-card';
import { getAccounts, getLatestSnapshot, getSettings, calculateNetWorth } from '@/lib/data';
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
    </main>
  );
}
