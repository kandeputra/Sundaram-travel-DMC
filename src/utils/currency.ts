import { CurrencyCode, ExchangeRateTable } from "../types";

// Base exchange rates: 1 IDR in foreign currency units (and 1 foreign currency in IDR)
export const DEFAULT_EXCHANGE_RATES: Record<CurrencyCode, number> = {
  IDR: 1,
  USD: 0.000063,     // 1 USD = ~15,873 IDR
  MYR: 0.00028,      // 1 MYR = ~3,571 IDR
  INR: 0.0053,       // 1 INR = ~188 IDR
  AUD: 0.000096,     // 1 AUD = ~10,416 IDR
  SGD: 0.000084,     // 1 SGD = ~11,904 IDR
  EUR: 0.000058,     // 1 EUR = ~17,241 IDR
  GBP: 0.000049,     // 1 GBP = ~20,408 IDR
};

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  IDR: "Rp",
  USD: "$",
  MYR: "RM",
  INR: "₹",
  AUD: "A$",
  SGD: "S$",
  EUR: "€",
  GBP: "£",
};

export const CURRENCY_NAMES: Record<CurrencyCode, string> = {
  IDR: "Indonesian Rupiah (IDR)",
  USD: "US Dollar (USD)",
  MYR: "Malaysian Ringgit (MYR)",
  INR: "Indian Rupee (INR)",
  AUD: "Australian Dollar (AUD)",
  SGD: "Singapore Dollar (SGD)",
  EUR: "Euro (EUR)",
  GBP: "British Pound (GBP)",
};

/**
 * Converts an IDR amount to the target currency
 */
export function convertFromIdr(
  amountIdr: number,
  targetCurrency: CurrencyCode,
  rates: Record<CurrencyCode, number> = DEFAULT_EXCHANGE_RATES
): number {
  if (targetCurrency === "IDR") return amountIdr;
  const rate = rates[targetCurrency] || DEFAULT_EXCHANGE_RATES[targetCurrency];
  const converted = amountIdr * rate;
  return targetCurrency === "INR" || targetCurrency === "MYR"
    ? Math.round(converted)
    : Math.round(converted * 100) / 100;
}

/**
 * Converts a foreign currency amount to IDR
 */
export function convertToIdr(
  amount: number,
  fromCurrency: CurrencyCode,
  rates: Record<CurrencyCode, number> = DEFAULT_EXCHANGE_RATES
): number {
  if (fromCurrency === "IDR") return amount;
  const rate = rates[fromCurrency] || DEFAULT_EXCHANGE_RATES[fromCurrency];
  return Math.round(amount / rate);
}

/**
 * Formats a currency amount with its appropriate symbol and standard decimal places
 */
export function formatCurrency(
  amountIdr: number,
  currency: CurrencyCode = "IDR",
  rates: Record<CurrencyCode, number> = DEFAULT_EXCHANGE_RATES
): string {
  const symbol = CURRENCY_SYMBOLS[currency] || "";
  const converted = convertFromIdr(amountIdr, currency, rates);

  if (currency === "IDR") {
    return `Rp ${Math.round(amountIdr).toLocaleString("id-ID")}`;
  }

  if (currency === "INR" || currency === "MYR") {
    return `${symbol} ${Math.round(converted).toLocaleString("en-US")}`;
  }

  // USD, EUR, GBP, AUD, SGD with 2 decimals
  return `${symbol} ${converted.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
