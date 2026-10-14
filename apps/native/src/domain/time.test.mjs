import assert from 'node:assert/strict';
import test from 'node:test';
import { effectiveHourFormat, HOUR_MS, instantAtRow, isRepeatedWallTime, localDateKey, offsetMinutes, resolveWallTime, zonedParts } from './time.ts';

test('rows are absolute elapsed hours across local midnight', () => {
  const first = Date.parse('2026-10-15T06:00:00Z');
  const next = instantAtRow(first, 1);
  assert.equal(next - first, HOUR_MS);
  assert.equal(localDateKey(first, 'America/Los_Angeles'), '2026-10-14');
  assert.equal(localDateKey(next, 'America/Los_Angeles'), '2026-10-15');
});

test('California and Douala change relative offset with DST', () => {
  const october = resolveWallTime({ year: 2026, month: 10, day: 14, hour: 8, minute: 0 }, 'America/Los_Angeles')[0];
  const january = resolveWallTime({ year: 2027, month: 1, day: 14, hour: 8, minute: 0 }, 'America/Los_Angeles')[0];
  assert.equal(zonedParts(october, 'Africa/Douala').hour, 16);
  assert.equal(zonedParts(january, 'Africa/Douala').hour, 17);
});

test('spring forward has no 02:30 but keeps hourly UTC rows', () => {
  assert.deepEqual(resolveWallTime({ year: 2026, month: 3, day: 8, hour: 2, minute: 30 }, 'America/Los_Angeles'), []);
  const before = Date.parse('2026-03-08T09:00:00Z');
  assert.equal(zonedParts(before, 'America/Los_Angeles').hour, 1);
  assert.equal(zonedParts(before + HOUR_MS, 'America/Los_Angeles').hour, 3);
});

test('fall back offers two distinguishable occurrences', () => {
  const matches = resolveWallTime({ year: 2026, month: 11, day: 1, hour: 1, minute: 30 }, 'America/Los_Angeles');
  assert.equal(matches.length, 2);
  assert.equal(matches[1] - matches[0], HOUR_MS);
  assert.notEqual(offsetMinutes(matches[0], 'America/Los_Angeles'), offsetMinutes(matches[1], 'America/Los_Angeles'));
  assert.ok(isRepeatedWallTime(matches[0], 'America/Los_Angeles'));
});

test('half-hour fall back also exposes both occurrences', () => {
  const matches = resolveWallTime({ year: 2026, month: 4, day: 5, hour: 1, minute: 45 }, 'Australia/Lord_Howe');
  assert.equal(matches.length, 2);
  assert.equal(matches[1] - matches[0], 30 * 60_000);
  assert.ok(isRepeatedWallTime(matches[0], 'Australia/Lord_Howe'));
});

test('fractional offsets and the date line use each city timezone', () => {
  const instant = Date.parse('2026-10-14T20:00:00Z');
  assert.equal(zonedParts(instant, 'Asia/Kathmandu').minute, 45);
  assert.equal(localDateKey(instant, 'Pacific/Auckland'), '2026-10-15');
});

test('system clock preference follows the device while an override wins', () => {
  assert.equal(effectiveHourFormat('system', true), '24h');
  assert.equal(effectiveHourFormat('system', false), '12h');
  assert.equal(effectiveHourFormat('12h', true), '12h');
});
