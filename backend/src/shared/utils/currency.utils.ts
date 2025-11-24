export function formatCurrency(amount: number, currency: string = 'USD', locale: string = 'en-US'): string {
  return amount.toLocaleString(locale, { style: 'currency', currency });
} 