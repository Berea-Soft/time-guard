import { describe, it, expect } from 'vitest';
import { timeGuard, TimeGuard, TemporalAdapter } from '../src/native';

describe('TimeGuard Native Mode Entry Point', () => {
  it('should export all essential classes and helper functions', () => {
    expect(TimeGuard).toBeDefined();
    expect(timeGuard).toBeDefined();
    expect(TemporalAdapter).toBeDefined();
  });

  it('should function properly when instantiating and doing operations', () => {
    const tg = timeGuard('2026-05-18T10:30:00');
    // toISOString always includes .SSS milliseconds
    expect(tg.toISOString()).toBe('2026-05-18T10:30:00.000Z');
    expect(tg.year()).toBe(2026);
    expect(tg.month()).toBe(5);
    expect(tg.day()).toBe(18);
    expect(tg.hour()).toBe(10);
    expect(tg.minute()).toBe(30);

    const advanced = tg.add({ days: 3 });
    expect(advanced.format('YYYY-MM-DD')).toBe('2026-05-21');
  });

  it('should compute durations between dates correctly in native mode', () => {
    const start = TimeGuard.from('2026-05-18');
    const end = TimeGuard.from('2026-05-25');
    const diff = start.diff(end, 'day');
    // diff() returns absolute difference in the specified unit
    expect(typeof diff).toBe('number');
    expect(diff).toBeGreaterThan(0);

    const range = TimeGuard.range(start, end);
    expect(range.toDuration().total('day')).toBe(7);
  });

  it('should handle TimeGuard.now() and basic operations', () => {
    const now = TimeGuard.now();
    expect(now.year()).toBeGreaterThanOrEqual(2024);
    expect(now.month()).toBeGreaterThanOrEqual(1);
    expect(now.month()).toBeLessThanOrEqual(12);
    expect(now.day()).toBeGreaterThanOrEqual(1);
    expect(now.day()).toBeLessThanOrEqual(31);
  });

  it('should correctly format dates with locale', () => {
    const tg = TimeGuard.from('2026-05-20');
    // Locale data uses capitalized month/weekday names
    expect(tg.locale('es').format('dddd, DD MMMM YYYY')).toBe(
      'Miércoles, 20 Mayo 2026',
    );
    expect(tg.locale('en').format('dddd, DD MMMM YYYY')).toBe(
      'Wednesday, 20 May 2026',
    );
  });
});
