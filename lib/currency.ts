// Currencies an admin can price contests, Photographer of the Year and store
// coin packs in. Mirrors the API's Payment/paymentCurrency.ts.
export const SUPPORTED_CURRENCIES = ['USD', 'EUR'] as const;
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];
export const DEFAULT_CURRENCY: SupportedCurrency = 'USD';

export const CURRENCY_LABELS: Record<SupportedCurrency, string> = {
  USD: 'USD ($)',
  EUR: 'EUR (€)',
};

// Smallest paid entry fee the API accepts per currency. 0 means free.
export const MIN_PAID_ENTRY_FEE: Record<SupportedCurrency, number> = {
  USD: 0.6,
  EUR: 0.5,
};

export const isSupportedCurrency = (value: unknown): value is SupportedCurrency =>
  typeof value === 'string' && (SUPPORTED_CURRENCIES as readonly string[]).includes(value);

// Older records may hold null or another prize currency; they were charged in USD.
export const toSupportedCurrency = (value?: string | null): SupportedCurrency => {
  const upper = value?.trim().toUpperCase();
  return isSupportedCurrency(upper) ? upper : DEFAULT_CURRENCY;
};

export const formatCurrencyAmount = (value?: number | null, currency?: string | null) => {
  const code = (currency || DEFAULT_CURRENCY).toUpperCase();
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: code }).format(
      Number(value ?? 0),
    );
  } catch {
    return `${Number(value ?? 0).toFixed(2)} ${code}`;
  }
};
