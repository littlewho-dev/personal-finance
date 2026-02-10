'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CurrencyDisplay } from '@/components/common/currency-display';
import { messages } from '@/lib/i18n/messages';
import type { AccountWithBalance, CurrencySettings } from '@/lib/types';

type SortKey = 'name' | 'subtype' | 'institution' | 'balance' | 'percent';
type SortDirection = 'asc' | 'desc';

interface CategoryTableProps {
  accounts: AccountWithBalance[];
  categoryLabel: string;
  categoryTotal: number;
  currency: CurrencySettings;
  testId: string;
}

const columns: { key: SortKey; label: string }[] = [
  { key: 'name', label: messages.accounts.name },
  { key: 'subtype', label: messages.accounts.subtype },
  { key: 'institution', label: messages.accounts.institution },
  { key: 'balance', label: messages.accounts.balance },
  { key: 'percent', label: messages.accounts.percentOfCategory },
];

function sortAccounts(accounts: AccountWithBalance[], key: SortKey, direction: SortDirection) {
  return [...accounts].sort((a, b) => {
    let cmp: number;
    switch (key) {
      case 'name':
        cmp = a.name.localeCompare(b.name);
        break;
      case 'subtype':
        cmp = messages.subtypes[a.subtype].localeCompare(messages.subtypes[b.subtype]);
        break;
      case 'institution':
        cmp = (a.institution ?? '').localeCompare(b.institution ?? '');
        break;
      case 'balance':
      case 'percent':
        cmp = a.balance - b.balance;
        break;
    }
    return direction === 'asc' ? cmp : -cmp;
  });
}

export function CategoryTable({
  accounts,
  categoryLabel,
  categoryTotal,
  currency,
  testId,
}: CategoryTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('balance');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sorted = sortAccounts(accounts, sortKey, sortDirection);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection(key === 'balance' || key === 'percent' ? 'desc' : 'asc');
    }
  };

  const arrow = (key: SortKey) => (sortKey === key ? (sortDirection === 'asc' ? ' ▲' : ' ▼') : '');

  return (
    <Card data-testid={testId}>
      <CardHeader>
        <CardTitle data-testid="category-heading" className="flex items-center gap-2">
          <span>{categoryLabel}</span>
          <span className="text-muted-foreground">&mdash;</span>
          <CurrencyDisplay amount={categoryTotal} currency={currency} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>
                  <button
                    type="button"
                    onClick={() => handleSort(col.key)}
                    className="font-medium hover:text-foreground"
                  >
                    {col.label}
                    {arrow(col.key)}
                  </button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((account) => (
              <TableRow key={account.id}>
                <TableCell data-testid="name-cell">{account.name}</TableCell>
                <TableCell>{messages.subtypes[account.subtype]}</TableCell>
                <TableCell>{account.institution ?? messages.accounts.emptyInstitution}</TableCell>
                <TableCell data-testid="balance-cell">
                  <CurrencyDisplay amount={account.balance} currency={currency} />
                </TableCell>
                <TableCell>
                  {categoryTotal > 0
                    ? `${((account.balance / categoryTotal) * 100).toFixed(1)}%`
                    : '0.0%'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
