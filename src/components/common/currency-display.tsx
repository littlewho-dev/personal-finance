import type { CurrencySettings } from '@/lib/types';

interface CurrencyDisplayProps {
  amount: number;
  currency: CurrencySettings;
  className?: string;
}

export function CurrencyDisplay({ amount, currency, className }: CurrencyDisplayProps) {
  const formatted = new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
  }).format(amount);

  return <span className={className}>{formatted}</span>;
}
