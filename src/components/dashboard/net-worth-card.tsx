import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CurrencyDisplay } from '@/components/common/currency-display';
import { messages } from '@/lib/i18n/messages';
import type { NetWorthBreakdown, CurrencySettings } from '@/lib/types';

interface NetWorthCardProps {
  breakdown: NetWorthBreakdown;
  currency: CurrencySettings;
  snapshotDate: string;
}

export function NetWorthCard({ breakdown, currency, snapshotDate }: NetWorthCardProps) {
  const formattedDate = new Intl.DateTimeFormat(currency.locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(snapshotDate));

  return (
    <Card data-testid="net-worth-card">
      <CardHeader>
        <CardTitle>{messages.dashboard.netWorth}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {messages.dashboard.asOf} {formattedDate}
        </p>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <CurrencyDisplay
            amount={breakdown.total}
            currency={currency}
            className="text-4xl font-bold"
          />
        </div>
        <div className="space-y-3">
          <div
            data-testid="category-cash"
            className="flex items-center justify-between rounded-lg bg-muted p-3"
          >
            <span className="font-medium">{messages.dashboard.cash}</span>
            <CurrencyDisplay
              amount={breakdown.cash}
              currency={currency}
              className="font-mono text-success"
            />
          </div>
          <div
            data-testid="category-assets"
            className="flex items-center justify-between rounded-lg bg-muted p-3"
          >
            <span className="font-medium">{messages.dashboard.assets}</span>
            <CurrencyDisplay
              amount={breakdown.assets}
              currency={currency}
              className="font-mono text-success"
            />
          </div>
          <div
            data-testid="category-debts"
            className="flex items-center justify-between rounded-lg bg-muted p-3"
          >
            <span className="font-medium">{messages.dashboard.debts}</span>
            <CurrencyDisplay
              amount={breakdown.debts}
              currency={currency}
              className="font-mono text-destructive"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
