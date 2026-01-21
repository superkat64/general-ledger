// lib/currencies.ts
export const CURRENCIES = {
  AUD: { code: 'AUD', symbol: '$', flag: '🇦🇺', name: 'Australian Dollar' },
  USD: { code: 'USD', symbol: '$', flag: '🇺🇸', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', flag: '🇪🇺', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', flag: '🇬🇧', name: 'British Pound' },
  JPY: { code: 'JPY', symbol: '¥', flag: '🇯🇵', name: 'Japanese Yen' },
  MXN: { code: 'MXN', symbol: '$', flag: '🇲🇽', name: 'Mexican Peso' },
  MYR: { code: 'MYR', symbol: 'RM', flag: '🇲🇾', name: 'Malaysian Ringgit' },
  THB: { code: 'THB', symbol: '฿', flag: '🇹🇭', name: 'Thai Baht' },
  VND: { code: 'VND', symbol: '₫', flag: '🇻🇳', name: 'Vietnamese Dong' },
  // ... add additional currencies as needed
} as const

export type CurrencyCode = keyof typeof CURRENCIES

export const currencyList = Object.values(CURRENCIES)