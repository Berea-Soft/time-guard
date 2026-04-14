/**
 * Temporal API Polyfill Verification Tests
 * Verify that the polyfill is loaded and working correctly
 */

import { describe, it, expect } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { TimeGuard, TemporalAdapter } from '../src/index';

describe('Temporal API Polyfill', () => {
  describe('Polyfill loading verification', () => {
    it('should have Temporal available from direct import', () => {
      expect(Temporal).toBeDefined();
      expect(Temporal.PlainDateTime).toBeDefined();
      expect(Temporal.Now).toBeDefined();
    });

    it('should have Temporal on globalThis after importing time-guard', () => {
      expect((globalThis as any).Temporal).toBeDefined();
      expect((globalThis as any).Temporal.PlainDateTime).toBeDefined();
    });

    it('should create PlainDateTime directly from imported Temporal', () => {
      const dt = Temporal.PlainDateTime.from('2024-03-13T14:30:45');
      expect(dt.year).toBe(2024);
      expect(dt.month).toBe(3);
      expect(dt.day).toBe(13);
      expect(dt.hour).toBe(14);
    });

    it('should get current time from Temporal.Now', () => {
      const now = Temporal.Now.plainDateTimeISO();
      expect(now.year).toBeGreaterThan(2000);
      expect(now.month).toBeGreaterThan(0);
      expect(now.day).toBeGreaterThan(0);
    });
  });

  describe('TemporalAdapter with direct Temporal objects', () => {
    it('should accept Temporal.PlainDateTime as input', () => {
      const plainDT = Temporal.PlainDateTime.from('2024-03-13T14:30:45');
      const result = TemporalAdapter.parseToPlainDateTime(plainDT);
      expect(result).toBe(plainDT);
    });

    it('should convert Temporal.PlainDate to PlainDateTime', () => {
      const plainDate = Temporal.PlainDate.from('2024-03-13');
      const result = TemporalAdapter.parseToPlainDateTime(plainDate);
      expect(result.year).toBe(2024);
      expect(result.month).toBe(3);
      expect(result.day).toBe(13);
      expect(result.hour).toBe(0);
    });

    it('should convert Temporal.PlainTime to PlainDateTime', () => {
      const plainTime = Temporal.PlainTime.from('14:30:45');
      const result = TemporalAdapter.parseToPlainDateTime(plainTime);
      expect(result.hour).toBe(14);
      expect(result.minute).toBe(30);
      expect(result.second).toBe(45);
    });

    it('should handle ZonedDateTime conversion', () => {
      const zonedDateTime = Temporal.Now.zonedDateTimeISO('UTC');
      const result = TemporalAdapter.parseToPlainDateTime(zonedDateTime);
      expect(result).toBeDefined();
      expect(result.year).toBeGreaterThan(2000);
    });

    it('should convert PlainDateTime to JavaScript Date', () => {
      const plainDT = Temporal.PlainDateTime.from('2024-03-13T14:30:45');
      const date = TemporalAdapter.toDate(plainDT);
      expect(date).toBeInstanceOf(Date);
      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth() + 1).toBe(3);
    });

    it('should convert PlainDateTime to Unix timestamp', () => {
      const plainDT = Temporal.PlainDateTime.from('2024-03-13T14:30:45');
      const unix = TemporalAdapter.toUnix(plainDT);
      expect(typeof unix).toBe('number');
      expect(unix).toBeGreaterThan(0);
    });

    it('should convert PlainDateTime to ISO string', () => {
      const plainDT = Temporal.PlainDateTime.from('2024-03-13T14:30:45');
      const iso = TemporalAdapter.toISOString(plainDT);
      expect(iso).toContain('2024-03-13');
      expect(iso).toContain('14:30:45');
    });

    it('should compare two PlainDateTime objects', () => {
      const dt1 = Temporal.PlainDateTime.from('2024-03-13T14:30:45');
      const dt2 = Temporal.PlainDateTime.from('2024-03-14T14:30:45');
      const result = TemporalAdapter.compare(dt1, dt2);
      expect(result).toBe(-1);
    });

    it('should compare equal PlainDateTime objects', () => {
      const dt1 = Temporal.PlainDateTime.from('2024-03-13T14:30:45');
      const dt2 = Temporal.PlainDateTime.from('2024-03-13T14:30:45');
      const result = TemporalAdapter.compare(dt1, dt2);
      expect(result).toBe(0);
    });
  });

  describe('TimeGuard integration with Temporal', () => {
    it('should convert TimeGuard to Temporal.PlainDateTime', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45');
      const temporal = tg.toTemporal();
      expect(temporal.year).toBe(2024);
      expect(temporal.month).toBe(3);
      expect(temporal.day).toBe(13);
    });

    it('should create TimeGuard from Temporal.PlainDateTime', () => {
      const plainDT = Temporal.PlainDateTime.from('2024-03-13T14:30:45');
      const tg = TimeGuard.fromTemporal(plainDT);
      expect(tg.format('YYYY-MM-DD HH:mm:ss')).toBe('2024-03-13 14:30:45');
    });

    it('should create TimeGuard from Temporal.Now', () => {
      const now = Temporal.Now.plainDateTimeISO();
      const tg = TimeGuard.fromTemporal(now);
      expect(tg).toBeDefined();
      expect(tg.get('year')).toBe(now.year);
    });

    it('should work with Temporal.Duration', () => {
      const tg1 = new TimeGuard('2024-03-13');
      const tg2 = new TimeGuard('2024-03-20');
      const duration = tg2.since(tg1);
      expect(duration.days).toBe(7);
    });

    it('should handle until() with Temporal options', () => {
      const tg1 = new TimeGuard('2024-03-13');
      const tg2 = new TimeGuard('2024-06-13');
      const duration = tg1.until(tg2, { largestUnit: 'month' });
      expect(duration.months).toBe(3);
    });
  });

  describe('Temporal API features', () => {
    it('should handle Temporal.Duration arithmetic', () => {
      const duration1 = Temporal.Duration.from({ days: 5 });
      const duration2 = Temporal.Duration.from({ days: 3 });
      const total = duration1.add(duration2);
      expect(total.days).toBe(8);
    });

    it('should handle Temporal.Instant from epoch milliseconds', () => {
      const instant = Temporal.Instant.fromEpochMilliseconds(1710339045000);
      expect(instant.epochMilliseconds).toBe(1710339045000);
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle invalid PlainDateTime creation', () => {
      expect(() => Temporal.PlainDateTime.from('invalid')).toThrow();
    });

    it('should handle invalid ISO string parsing', () => {
      expect(() => TemporalAdapter.parseISOString('invalid-date-string')).toBeDefined();
    });

    it('should handle timezone not found error', () => {
      expect(() => Temporal.TimeZone.from('Invalid/Timezone')).toThrow();
    });
  });
});
