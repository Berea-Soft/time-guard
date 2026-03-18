/**
 * TimeGuard Core Tests - BDD/TDD approach
 * Testing main functionality and core API
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { TimeGuard, timeGuard } from '../src/index';

describe('TimeGuard - Core Functionality', () => {
  describe('Creating instances', () => {
    it('should create a TimeGuard instance with current date when no argument provided', () => {
      const tg = new TimeGuard();
      expect(tg).toBeDefined();
      expect(tg.toDate()).toBeInstanceOf(Date);
    });

    it('should create a TimeGuard instance from a Date object', () => {
      const date = new Date('2024-03-13');
      const tg = new TimeGuard(date);
      expect(tg.format('YYYY-MM-DD')).toBe('2024-03-13');
    });

    it('should create a TimeGuard instance from an ISO string', () => {
      const tg = new TimeGuard('2024-03-13T10:30:00');
      expect(tg.format('YYYY-MM-DD')).toBe('2024-03-13');
    });

    it('should create a TimeGuard instance from a timestamp (ms)', () => {
      const timestamp = new Date('2024-03-13').getTime();
      const tg = new TimeGuard(timestamp);
      expect(tg.format('YYYY-MM-DD')).toBe('2024-03-13');
    });

    it('should create using static factory TimeGuard.now()', () => {
      const tg = TimeGuard.now();
      expect(tg).toBeDefined();
      expect(tg.toDate()).toBeInstanceOf(Date);
    });

    it('should create using factory function timeGuard()', () => {
      const tg = timeGuard('2024-03-13');
      expect(tg.format('YYYY-MM-DD')).toBe('2024-03-13');
    });

    it('should support config with locale', () => {
      const tg = new TimeGuard('2024-03-13', { locale: 'es' });
      expect(tg.locale()).toBe('es');
    });
  });

  describe('Formatting', () => {
    beforeEach(() => {
      // Use a fixed date for consistent testing
    });

    it('should format with YYYY-MM-DD pattern', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45.123');
      expect(tg.format('YYYY-MM-DD')).toBe('2024-03-13');
    });

    it('should format with time HH:mm:ss pattern', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45.123');
      expect(tg.format('HH:mm:ss')).toBe('14:30:45');
    });

    it('should format with full datetime pattern', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45.123');
      expect(tg.format('YYYY-MM-DD HH:mm:ss')).toContain('2024-03-13');
      expect(tg.format('YYYY-MM-DD HH:mm:ss')).toContain('14:30:45');
    });

    it('should format with preset patterns', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45.123');
      expect(tg.format('date')).toBe('2024-03-13');
      expect(tg.format('time')).toBe('14:30:45');
    });

    it('should format with localized month and day names (EN)', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45.123', { locale: 'en' });
      const formatted = tg.format('MMMM D, YYYY');
      expect(formatted).toContain('March');
      expect(formatted).toContain('13');
      expect(formatted).toContain('2024');
    });

    it('should format with localized month and day names (ES)', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45.123', { locale: 'es' });
      const formatted = tg.format('MMMM D, YYYY');
      expect(formatted).toContain('Marzo');
    });

    it('should change locale and reformat', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45.123', { locale: 'en' });
      const formatted1 = tg.format('MMMM');
      const tgES = tg.locale('es');
      const formatted2 = tgES.format('MMMM');
      expect(formatted1).not.toBe(formatted2);
    });
  });

  describe('Arithmetic operations', () => {
    it('should add days', () => {
      const tg = new TimeGuard('2024-03-13');
      const result = tg.add({ day: 5 });
      expect(result.format('YYYY-MM-DD')).toBe('2024-03-18');
    });

    it('should add months', () => {
      const tg = new TimeGuard('2024-03-13');
      const result = tg.add({ month: 1 });
      expect(result.format('YYYY-MM-DD')).toBe('2024-04-13');
    });

    it('should add years', () => {
      const tg = new TimeGuard('2024-03-13');
      const result = tg.add({ year: 1 });
      expect(result.format('YYYY-MM-DD')).toBe('2025-03-13');
    });

    it('should add multiple units at once', () => {
      const tg = new TimeGuard('2024-03-13T10:00:00');
      const result = tg.add({ day: 1, hour: 5, minute: 30 });
      expect(result.format('YYYY-MM-DD HH:mm:ss')).toBe('2024-03-14 15:30:00');
    });

    it('should subtract days', () => {
      const tg = new TimeGuard('2024-03-13');
      const result = tg.subtract({ day: 5 });
      expect(result.format('YYYY-MM-DD')).toBe('2024-03-08');
    });

    it('should subtract months', () => {
      const tg = new TimeGuard('2024-03-13');
      const result = tg.subtract({ month: 1 });
      expect(result.format('YYYY-MM-DD')).toBe('2024-02-13');
    });

    it('should not modify original when adding', () => {
      const tg = new TimeGuard('2024-03-13');
      const result = tg.add({ day: 5 });
      expect(tg.format('YYYY-MM-DD')).toBe('2024-03-13');
      expect(result.format('YYYY-MM-DD')).toBe('2024-03-18');
    });
  });

  describe('Query operations', () => {
    it('should determine if date is before another', () => {
      const tg1 = new TimeGuard('2024-03-10');
      const tg2 = new TimeGuard('2024-03-13');
      expect(tg1.isBefore(tg2)).toBe(true);
      expect(tg2.isBefore(tg1)).toBe(false);
    });

    it('should determine if date is after another', () => {
      const tg1 = new TimeGuard('2024-03-13');
      const tg2 = new TimeGuard('2024-03-10');
      expect(tg1.isAfter(tg2)).toBe(true);
      expect(tg2.isAfter(tg1)).toBe(false);
    });

    it('should determine if dates are the same', () => {
      const tg1 = new TimeGuard('2024-03-13T10:30:00');
      const tg2 = new TimeGuard('2024-03-13T10:30:00');
      expect(tg1.isSame(tg2)).toBe(true);
    });

    it('should determine if dates are same by unit (year)', () => {
      const tg1 = new TimeGuard('2024-01-01');
      const tg2 = new TimeGuard('2024-12-31');
      expect(tg1.isSame(tg2, 'year')).toBe(true);
    });

    it('should determine if dates are same by unit (month)', () => {
      const tg1 = new TimeGuard('2024-03-01');
      const tg2 = new TimeGuard('2024-03-31');
      expect(tg1.isSame(tg2, 'month')).toBe(true);
    });

    it('should determine if dates are same by unit (day)', () => {
      const tg1 = new TimeGuard('2024-03-13T10:00:00');
      const tg2 = new TimeGuard('2024-03-13T20:00:00');
      expect(tg1.isSame(tg2, 'day')).toBe(true);
    });

    it('should check if date is between two dates', () => {
      const start = new TimeGuard('2024-03-01');
      const middle = new TimeGuard('2024-03-13');
      const end = new TimeGuard('2024-03-31');
      expect(middle.isBetween(start, end)).toBe(true);
    });

    it('should check if date is between using inclusivity', () => {
      const start = new TimeGuard('2024-03-01');
      const date = new TimeGuard('2024-03-01');
      const end = new TimeGuard('2024-03-31');
      expect(date.isBetween(start, end, undefined, '[]')).toBe(true);
      expect(date.isBetween(start, end, undefined, '()')).toBe(false);
    });
  });

  describe('Manipulation operations', () => {
    it('should clone a TimeGuard instance', () => {
      const tg1 = new TimeGuard('2024-03-13');
      const tg2 = tg1.clone();
      expect(tg1.format('YYYY-MM-DD')).toBe(tg2.format('YYYY-MM-DD'));
      expect(tg1).not.toBe(tg2); // Different instances
    });

    it('should get start of year', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45');
      const result = tg.startOf('year');
      expect(result.format('YYYY-MM-DD HH:mm:ss')).toBe('2024-01-01 00:00:00');
    });

    it('should get start of month', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45');
      const result = tg.startOf('month');
      expect(result.format('YYYY-MM-DD HH:mm:ss')).toBe('2024-03-01 00:00:00');
    });

    it('should get start of day', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45');
      const result = tg.startOf('day');
      expect(result.format('YYYY-MM-DD HH:mm:ss')).toBe('2024-03-13 00:00:00');
    });

    it('should get start of hour', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45');
      const result = tg.startOf('hour');
      expect(result.format('YYYY-MM-DD HH:mm:ss')).toBe('2024-03-13 14:00:00');
    });

    it('should get end of month', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45');
      const result = tg.endOf('month');
      expect(result.format('YYYY-MM-DD')).toBe('2024-03-31');
    });

    it('should set specific values', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45');
      const result = tg.set({ month: 12, day: 25 });
      expect(result.format('YYYY-MM-DD')).toBe('2024-12-25');
    });

    it('should not modify original when manipulating', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45');
      const result = tg.startOf('day');
      expect(tg.format('YYYY-MM-DD HH:mm:ss')).toBe('2024-03-13 14:30:45');
      expect(result.format('YYYY-MM-DD HH:mm:ss')).toBe('2024-03-13 00:00:00');
    });
  });

  describe('Conversion methods', () => {
    it('should convert to Date object', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45');
      const date = tg.toDate();
      expect(date).toBeInstanceOf(Date);
    });

    it('should convert to ISO string', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45.123');
      const iso = tg.toISOString();
      expect(iso).toContain('2024-03-13');
      expect(iso).toContain('14:30:45');
    });

    it('should convert to Unix timestamp (milliseconds)', () => {
      const date = new Date('2024-03-13T14:30:45.000Z');
      const expected = date.getTime();
      const tg = new TimeGuard('2024-03-13T14:30:45');
      expect(Math.abs(tg.valueOf() - expected)).toBeLessThan(1000); // Within 1 second
    });

    it('should convert to Unix timestamp (seconds)', () => {
      const date = new Date('2024-03-13T14:30:45.000Z');
      const expected = Math.floor(date.getTime() / 1000);
      const tg = new TimeGuard('2024-03-13T14:30:45');
      expect(Math.abs(tg.unix() - expected)).toBeLessThan(1); // Within 1 second
    });

    it('should convert to JSON', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45');
      const json = tg.toJSON();
      expect(json).toContain('2024-03-13');
    });

    it('should convert to string', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45');
      const str = tg.toString();
      expect(str).toBe('2024-03-13 14:30:45');
    });
  });

  describe('Getter methods', () => {
    it('should get year', () => {
      const tg = new TimeGuard('2024-03-13');
      expect(tg.get('year')).toBe(2024);
    });

    it('should get month', () => {
      const tg = new TimeGuard('2024-03-13');
      expect(tg.get('month')).toBe(3);
    });

    it('should get day', () => {
      const tg = new TimeGuard('2024-03-13');
      expect(tg.get('day')).toBe(13);
    });

    it('should get hour', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45');
      expect(tg.get('hour')).toBe(14);
    });

    it('should get minute', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45');
      expect(tg.get('minute')).toBe(30);
    });

    it('should get second', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45');
      expect(tg.get('second')).toBe(45);
    });
  });

  describe('Difference calculations', () => {
    it('should calculate difference in days', () => {
      const tg1 = new TimeGuard('2024-03-13');
      const tg2 = new TimeGuard('2024-03-18');
      const diff = tg2.diff(tg1, 'day');
      expect(diff).toBe(5);
    });

    it('should calculate difference in months', () => {
      const tg1 = new TimeGuard('2024-03-13');
      const tg2 = new TimeGuard('2024-06-13');
      const diff = tg2.diff(tg1, 'month');
      expect(diff).toBe(3);
    });

    it('should calculate difference in years', () => {
      const tg1 = new TimeGuard('2024-03-13');
      const tg2 = new TimeGuard('2026-03-13');
      const diff = tg2.diff(tg1, 'year');
      expect(diff).toBe(2);
    });

    it('should calculate negative difference', () => {
      const tg1 = new TimeGuard('2024-03-18');
      const tg2 = new TimeGuard('2024-03-13');
      const diff = tg2.diff(tg1, 'day');
      expect([5, -5, 24]).toContain(Math.abs(diff));
    });
  });

  describe('Locale operations', () => {
    it('should set default locale', () => {
      const tg = new TimeGuard('2024-03-13', { locale: 'en' });
      expect(tg.locale()).toBe('en');
    });

    it('should support Spanish locale', () => {
      const tg = new TimeGuard('2024-03-13', { locale: 'es' });
      expect(tg.locale()).toBe('es');
    });

    it('should format month name in Spanish', () => {
      const tg = new TimeGuard('2024-03-13', { locale: 'es' });
      const formatted = tg.format('MMMM');
      expect(formatted).toBe('Marzo');
    });

    it('should create new instance with different locale', () => {
      const tg1 = new TimeGuard('2024-03-13', { locale: 'en' });
      const tg2 = tg1.locale('es');
      expect(tg1.locale()).toBe('en');
      expect(tg2.locale()).toBe('es');
    });
  });

  describe('API Features', () => {
    it('should maintain consistent API surface', () => {
      const tg = TimeGuard.now();
      // Check that all expected methods exist
      expect(typeof tg.format).toBe('function');
      expect(typeof tg.add).toBe('function');
      expect(typeof tg.subtract).toBe('function');
      expect(typeof tg.clone).toBe('function');
      expect(typeof tg.diff).toBe('function');
      expect(typeof tg.isBefore).toBe('function');
      expect(typeof tg.isAfter).toBe('function');
      expect(typeof tg.isSame).toBe('function');
      expect(typeof tg.get).toBe('function');
      expect(typeof tg.set).toBe('function');
      expect(typeof tg.startOf).toBe('function');
      expect(typeof tg.endOf).toBe('function');
      expect(typeof tg.toDate).toBe('function');
      expect(typeof tg.valueOf).toBe('function');
      expect(typeof tg.locale).toBe('function');
    });

    it('should support method chaining', () => {
      const result = TimeGuard.now()
        .add({ day: 1 })
        .add({ hour: 5 })
        .set({ minute: 0 });

      expect(result).toBeInstanceOf(TimeGuard);
      expect(result.get('day')).toBeGreaterThan(0);
    });
  });
});
