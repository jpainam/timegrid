export const HOUR_MS = 3_600_000;

export type HourFormat = 'system' | '12h' | '24h';
export type WallTime = { year: number; month: number; day: number; hour: number; minute: number };

const partsCache = new Map<string, Intl.DateTimeFormat>();
const displayCache = new Map<string, Intl.DateTimeFormat>();

function displayFormatter(key: string, options: Intl.DateTimeFormatOptions, locale?: string) {
  const cacheKey = `${locale ?? 'device'}|${key}`;
  let value = displayCache.get(cacheKey);
  if (!value) {
    value = new Intl.DateTimeFormat(locale, options);
    displayCache.set(cacheKey, value);
  }
  return value;
}

function formatter(timeZone: string) {
  let value = partsCache.get(timeZone);
  if (!value) {
    value = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
    });
    partsCache.set(timeZone, value);
  }
  return value;
}

export function isValidTimeZone(timeZone: string) {
  try { formatter(timeZone); return true; } catch { return false; }
}

export function zonedParts(instantMs: number, timeZone: string): WallTime {
  const parts = formatter(timeZone).formatToParts(instantMs);
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  return { year: get('year'), month: get('month'), day: get('day'), hour: get('hour'), minute: get('minute') };
}

export function offsetMinutes(instantMs: number, timeZone: string) {
  const parts = zonedParts(instantMs, timeZone);
  const instantMinute = Math.floor(instantMs / 60_000) * 60_000;
  return (Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute) - instantMinute) / 60_000;
}

export function offsetLabel(instantMs: number, timeZone: string) {
  const minutes = offsetMinutes(instantMs, timeZone);
  const sign = minutes < 0 ? '−' : '+';
  const absolute = Math.abs(minutes);
  return `UTC${sign}${String(Math.floor(absolute / 60)).padStart(2, '0')}:${String(absolute % 60).padStart(2, '0')}`;
}

export function localDateKey(instantMs: number, timeZone: string) {
  const { year, month, day } = zonedParts(instantMs, timeZone);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function formatTime(instantMs: number, timeZone: string, hourFormat: HourFormat, locale?: string) {
  return displayFormatter(`time|${timeZone}|${hourFormat}`, {
    timeZone, hour: 'numeric', minute: '2-digit',
    hour12: hourFormat === 'system' ? undefined : hourFormat === '12h',
  }, locale).format(instantMs);
}

export function formatDate(instantMs: number, timeZone: string, locale?: string, long = false) {
  return displayFormatter(`date|${timeZone}|${long}`, {
    timeZone, weekday: 'short', month: long ? 'long' : 'short', day: 'numeric',
    ...(long ? { year: 'numeric' as const } : {}),
  }, locale).format(instantMs);
}

export function formatDateTime(instantMs: number, timeZone: string, hourFormat: HourFormat, locale?: string) {
  return `${formatDate(instantMs, timeZone, locale, true)} · ${formatTime(instantMs, timeZone, hourFormat, locale)}`;
}

export function isRepeatedWallTime(instantMs: number, timeZone: string) {
  if (offsetMinutes(instantMs - 24 * HOUR_MS, timeZone) === offsetMinutes(instantMs + 24 * HOUR_MS, timeZone)) {
    return false;
  }
  return resolveWallTime(zonedParts(instantMs, timeZone), timeZone).length > 1;
}

export function utcHour(instantMs: number) {
  return Math.floor(instantMs / HOUR_MS) * HOUR_MS;
}

export function effectiveHourFormat(preference: HourFormat, uses24hourClock: boolean | null): HourFormat {
  if (preference !== 'system' || uses24hourClock === null) return preference;
  return uses24hourClock ? '24h' : '12h';
}

export function instantAtRow(anchorMs: number, index: number) {
  return anchorMs + index * HOUR_MS;
}

export function parseWallTime(date: string, time: string): WallTime | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return null;
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const check = new Date(Date.UTC(year, month - 1, day));
  if (check.getUTCFullYear() !== year || check.getUTCMonth() + 1 !== month || check.getUTCDate() !== day || hour > 23 || minute > 59) return null;
  return { year, month, day, hour, minute };
}

/** All matching instants, so the fall-back hour can offer both occurrences. */
export function resolveWallTime(wall: WallTime, timeZone: string): number[] {
  const naive = Date.UTC(wall.year, wall.month - 1, wall.day, wall.hour, wall.minute);
  const offsets = new Set<number>();
  for (const delta of [-36, -24, -12, 0, 12, 24, 36]) {
    offsets.add(offsetMinutes(naive + delta * HOUR_MS, timeZone));
  }
  return [...offsets].map((offset) => naive - offset * 60_000).filter((instant) => {
    const value = zonedParts(instant, timeZone);
    return Object.keys(wall).every((key) => value[key as keyof WallTime] === wall[key as keyof WallTime]);
  }).sort((a, b) => a - b);
}
