export const messages = {
  common: {
    appName: 'Personal Finance',
    loading: 'Loading...',
    noData: 'No data available',
  },
  dashboard: {
    title: 'Dashboard',
    netWorth: 'Net Worth',
    breakdown: 'Breakdown',
    cash: 'Cash',
    assets: 'Assets',
    debts: 'Debts',
    asOf: 'As of',
  },
  accounts: {
    name: 'Name',
    balance: 'Balance',
    institution: 'Institution',
    type: 'Type',
  },
  history: {
    title: 'History',
    selectSnapshot: 'Select a snapshot to view',
    snapshotDate: 'Snapshot Date',
  },
  settings: {
    title: 'Settings',
    currency: 'Currency',
    currencyCode: 'Currency Code',
    currencySymbol: 'Symbol',
    locale: 'Locale',
  },
  categories: {
    cash: 'Cash',
    asset: 'Assets',
    debt: 'Debts',
  },
  subtypes: {
    checking: 'Checking',
    savings: 'Savings',
    deposit: 'Deposit',
    cash_on_hand: 'Cash on Hand',
    investment: 'Investment',
    retirement: 'Retirement',
    property: 'Property',
    vehicle: 'Vehicle',
    crypto: 'Crypto',
    credit_card: 'Credit Card',
    mortgage: 'Mortgage',
    student_loan: 'Student Loan',
    auto_loan: 'Auto Loan',
    personal_loan: 'Personal Loan',
  },
} as const;

export type Messages = typeof messages;
