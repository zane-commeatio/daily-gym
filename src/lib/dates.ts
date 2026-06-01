/**
 * Parse YYYY-MM-DD as UTC calendar date (no TZ drift).
 * @param iso The date string in YYYY-MM-DD format.
 * @returns A Date object representing the UTC midnight of that date.
 */
export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/**
 * Format a Date as YYYY-MM-DD in UTC.
 * @param d The date to format.
 * @returns The formatted date string.
 */
export function formatIsoDate(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Inclusive calendar-day difference: how many steps from `from` to `to` (same day = 0).
 * @param fromIso The start date (YYYY-MM-DD).
 * @param toIso The end date (YYYY-MM-DD).
 * @returns The number of calendar days between the two dates.
 */
export function calendarDaysBetween(fromIso: string, toIso: string): number {
  const a = parseIsoDate(fromIso).getTime();
  const b = parseIsoDate(toIso).getTime();
  return Math.round((b - a) / 86400000);
}

/**
 * Add a number of calendar days to a date string.
 * @param iso The start date (YYYY-MM-DD).
 * @param delta Number of days to add (can be negative).
 * @returns The resulting date string.
 */
export function addCalendarDays(iso: string, delta: number): string {
  const d = parseIsoDate(iso);
  d.setUTCDate(d.getUTCDate() + delta);
  return formatIsoDate(d);
}
