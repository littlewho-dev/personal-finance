export type AccountType = 'cash' | 'asset' | 'debt';

export type AccountSubtype =
  | 'checking'
  | 'savings'
  | 'deposit'
  | 'cash_on_hand'
  | 'investment'
  | 'retirement'
  | 'property'
  | 'vehicle'
  | 'crypto'
  | 'credit_card'
  | 'mortgage'
  | 'student_loan'
  | 'auto_loan'
  | 'personal_loan';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  subtype: AccountSubtype;
  institution?: string;
}

export interface Balance {
  accountId: string;
  amount: number;
}

export interface Snapshot {
  id: string;
  date: string;
  balances: Balance[];
}

export interface CurrencySettings {
  code: string;
  symbol: string;
  locale: string;
}

export interface Settings {
  currency: CurrencySettings;
}

export interface NetWorthBreakdown {
  cash: number;
  assets: number;
  debts: number;
  total: number;
}
