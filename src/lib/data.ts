import type { Account, Snapshot, Settings, NetWorthBreakdown } from './types';

import accountsData from '@/data/accounts.json';
import snapshotsData from '@/data/snapshots.json';
import settingsData from '@/data/settings.json';

export function getAccounts(): Account[] {
  return accountsData as Account[];
}

export function getSnapshots(): Snapshot[] {
  return snapshotsData as Snapshot[];
}

export function getLatestSnapshot(): Snapshot | null {
  const snapshots = getSnapshots();
  if (snapshots.length === 0) return null;
  return snapshots.sort((a, b) => b.date.localeCompare(a.date))[0];
}

export function getSettings(): Settings {
  return settingsData as Settings;
}

export function calculateNetWorth(snapshot: Snapshot, accounts: Account[]): NetWorthBreakdown {
  const accountMap = new Map(accounts.map((a) => [a.id, a]));

  let cash = 0;
  let assets = 0;
  let debts = 0;

  for (const balance of snapshot.balances) {
    const account = accountMap.get(balance.accountId);
    if (!account) continue;

    switch (account.type) {
      case 'cash':
        cash += balance.amount;
        break;
      case 'asset':
        assets += balance.amount;
        break;
      case 'debt':
        debts += balance.amount;
        break;
    }
  }

  return {
    cash,
    assets,
    debts,
    total: cash + assets - debts,
  };
}
