import { TZDate } from '@date-fns/tz';

const pad = (value: number) => String(value).padStart(2, '0');

/**
 * Parses a `datetime-local` input value (e.g. "2026-09-01T14:30") as wall-clock
 * time in `timeZone` and returns the equivalent UTC instant. Without this, native
 * `Date` parsing assumes the browser's local timezone instead of the contest's.
 */
export function zonedInputToDate(inputValue: string, timeZone: string): Date {
  const [datePart, timePart = '00:00'] = inputValue.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  return new Date(TZDate.tz(timeZone, year, month - 1, day, hour, minute).getTime());
}

/**
 * Formats a UTC date instant as a `datetime-local` input value, showing the
 * wall-clock time it corresponds to in `timeZone`.
 */
export function dateToZonedInput(value: Date | undefined, timeZone: string): string {
  if (!value || Number.isNaN(value.getTime())) return '';
  const zoned = new TZDate(value, timeZone);
  return `${zoned.getFullYear()}-${pad(zoned.getMonth() + 1)}-${pad(zoned.getDate())}T${pad(zoned.getHours())}:${pad(zoned.getMinutes())}`;
}

/**
 * Formats a stored UTC date string for display in `timeZone`.
 */
export function formatInTimeZone(value: string | undefined, timeZone: string): string {
  if (!value) return 'Not available';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not available';
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone,
  }).format(date);
}
