/**
 * Pure helper for normalizing and validating Nigerian phone numbers
 * for local Nigerian services.
 *
 * The backend expects the normal local Nigerian format:
 * 11 digits starting with 0, e.g. 07044316229. No spaces, no dashes, no brackets, no +234.
 */
export function normalizeNigerianPhone(input: string): { value: string; valid: boolean } {
  let cleaned = (input ?? "").replace(/[\s\-().[\]{}]/g, "");

  if (cleaned.startsWith("+234") && /^\d{10}$/.test(cleaned.slice(4))) {
    cleaned = "0" + cleaned.slice(4);
  } else if (cleaned.startsWith("234") && /^\d{10}$/.test(cleaned.slice(3))) {
    cleaned = "0" + cleaned.slice(3);
  }

  const valid = /^0\d{10}$/.test(cleaned);
  return { value: cleaned, valid };
}
