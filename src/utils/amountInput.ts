/** Keeps digits only (max 10) and adds thousands separators: "5000" -> "5,000". */
export function formatAmountInput(raw: string): string {
  const digits = raw
    .replace(/\D/g, "")
    .replace(/^0+(?=\d)/, "")
    .slice(0, 10);
  if (!digits) return "";
  return Number(digits).toLocaleString("en-US");
}

/** "5,000" -> 5000 (0 when empty or invalid). */
export function parseAmountInput(value: string): number {
  const n = Number(value.replace(/,/g, ""));
  return Number.isFinite(n) && n > 0 ? n : 0;
}
