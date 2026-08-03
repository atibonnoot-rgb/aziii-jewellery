/**
 * Formats a numeric price into INR currency format with the Rupee symbol (₹).
 * Example: 1250 -> ₹1,250
 */
export function formatPrice(price: number | undefined | null): string {
  if (price == null || isNaN(price)) return '₹0';
  return '₹' + Math.round(price).toLocaleString('en-IN');
}
