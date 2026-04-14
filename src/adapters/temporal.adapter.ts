/**
 * Temporal Adapter - Convert to/from JavaScript's Temporal API
 * Single Responsibility: Handle all Temporal API conversions
 * Note: The polyfill must be loaded by the consumer or via the "full" entry.
 */

import { Temporal } from "@js-temporal/polyfill";

type TemporalPlainDateTime = Temporal.PlainDateTime;
type TemporalZonedDateTime = Temporal.ZonedDateTime;

// Cache to prevent repeated loading attempts
let temporalCache: any = null;
let polyfillLoaded = false;

/**
 * Synchronous version that assumes Temporal is already loaded or loads it
 */
function useTemporal(): any {
  // Return cached value if available
  if (temporalCache) {
    return temporalCache;
  }

  const Temporal = (globalThis as any).Temporal;

  if (!Temporal) {
    // Try to load polyfill synchronously in Node.js
    if (!polyfillLoaded && typeof globalThis.require === 'function') {
      try {
        globalThis.require('@js-temporal/polyfill');
        polyfillLoaded = true;
        const TemporalLoaded = (globalThis as any).Temporal;
        if (TemporalLoaded) {
          temporalCache = TemporalLoaded;
          return TemporalLoaded;
        }
      } catch (e) {
        // Fall through to error
      }
    }
    
    throw new Error('Temporal API not loaded. Make sure @js-temporal/polyfill is imported in your app.');
  }

  temporalCache = Temporal;
  return Temporal;
}

/**
 * Adapter for Temporal date/time operations
 */
export class TemporalAdapter {
  /**
   * Parse various input formats to Temporal.PlainDateTime
   */
  static parseToPlainDateTime(input: unknown): TemporalPlainDateTime {
    const Temporal = useTemporal();
    
    // Handle Temporal objects
    if (this.isPlainDateTime(input)) {
      return input;
    }

    if (this.isZonedDateTime(input)) {
      return (input as any).toPlainDateTime();
    }

    if (this.isPlainDate(input)) {
      return (input as any).toPlainDateTime({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    }

    if (this.isPlainTime(input)) {
      const now = Temporal.Now.plainDateTimeISO();
      return now.with(input as any);
    }

    // Handle JavaScript Date
    if (input !== null && typeof input === 'object' && 'getTime' in input && typeof (input as any).getTime === 'function') {
      return this.fromDate(input as Date);
    }

    // Handle timestamp (milliseconds)
    if (typeof input === 'number') {
      return this.fromUnix(input);
    }

    // Handle ISO string
    if (typeof input === 'string') {
      return this.parseISOString(input);
    }

    // Handle object with date components
    if (typeof input === 'object' && input !== null) {
      return this.fromObject(input as Record<string, any>);
    }

    // Default to now
    return Temporal.Now.plainDateTimeISO();
  }

  /**
   * Convert JavaScript Date to Temporal.PlainDateTime
   */
  static fromDate(date: Date): TemporalPlainDateTime {
    const Temporal = useTemporal();
    const iso = date.toISOString();
    const [datePart, timePart] = iso.split('T');
    return Temporal.PlainDateTime.from(datePart + 'T' + timePart.slice(0, -1));
  }

  /**
   * Convert Unix timestamp (milliseconds) to Temporal.PlainDateTime
   */
  static fromUnix(timestamp: number): TemporalPlainDateTime {
    return this.fromDate(new Date(timestamp));
  }

  /**
   * Parse ISO string to Temporal.PlainDateTime
   */
  static parseISOString(iso: string): TemporalPlainDateTime {
    const Temporal = useTemporal();
    try {
      // Try as full ISO datetime (with T or space separator)
      if (iso.includes('T') || / \d{2}:\d{2}/.test(iso)) {
        // Normalize space to T for Temporal parsing
        const normalized = iso.replace(' ', 'T');
        return Temporal.PlainDateTime.from(normalized);
      }
      // Try as date only
      return Temporal.PlainDate.from(iso).toPlainDateTime({ hour: 0 });
    } catch {
      return Temporal.Now.plainDateTimeISO();
    }
  }

  /**
   * Create from object with date components
   */
  static fromObject(obj: Record<string, any>): TemporalPlainDateTime {
    const Temporal = useTemporal();
    const year = obj.year || Temporal.Now.plainDateISO().year;
    const month = obj.month || 1;
    const day = obj.day || 1;
    const hour = obj.hour || 0;
    const minute = obj.minute || 0;
    const second = obj.second || 0;
    const millisecond = obj.millisecond || 0;

    return Temporal.PlainDateTime.from({
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
    });
  }

  /**
   * Convert Temporal.PlainDateTime to JavaScript Date
   */
  static toDate(temporal: TemporalPlainDateTime | TemporalZonedDateTime): Date {
    const plainDT = this.toPlainDateTime(temporal);
    return new Date(plainDT.toString());
  }

  /**
   * Convert to Unix timestamp (milliseconds)
   */
  static toUnix(temporal: TemporalPlainDateTime | TemporalZonedDateTime): number {
    const plainDT = this.toPlainDateTime(temporal);
    // Use UTC to avoid timezone offset issues
    return Date.UTC(
      plainDT.year,
      plainDT.month - 1,
      plainDT.day,
      plainDT.hour,
      plainDT.minute,
      plainDT.second,
      plainDT.millisecond
    );
  }

  /**
   * Convert to ISO string
   */
  static toISOString(temporal: TemporalPlainDateTime | TemporalZonedDateTime): string {
    return this.toPlainDateTime(temporal).toString() + 'Z';
  }

  /**
   * Ensure we have a PlainDateTime
   */
  static toPlainDateTime(temporal: TemporalPlainDateTime | TemporalZonedDateTime): TemporalPlainDateTime {
    if (this.isPlainDateTime(temporal)) {
      return temporal;
    }
    return (temporal as any).toPlainDateTime();
  }

  /**
   * Type guards
   */
  static isPlainDateTime(obj: unknown): obj is TemporalPlainDateTime {
    return obj !== null && typeof obj === 'object' && 'year' in obj && 'month' in obj && 'day' in obj && 'hour' in obj;
  }

  static isZonedDateTime(obj: unknown): obj is TemporalZonedDateTime {
    return obj !== null && typeof obj === 'object' && 'timeZone' in obj;
  }

  static isPlainDate(obj: unknown): obj is any {
    return obj !== null && typeof obj === 'object' && 'year' in obj && 'month' in obj && 'day' in obj && !('hour' in obj) && 'toPlainDateTime' in obj;
  }

  static isPlainTime(obj: unknown): obj is any {
    return obj !== null && typeof obj === 'object' && 'hour' in obj && !('year' in obj);
  }

  /**
   * Get current time as PlainDateTime
   */
  static now(): TemporalPlainDateTime {
    const Temporal = useTemporal();
    return Temporal.Now.plainDateTimeISO();
  }

  /**
   * Get current time as ZonedDateTime with timezone
   */
  static nowInTimezone(timezone: string): TemporalZonedDateTime {
    const Temporal = useTemporal();
    return Temporal.Now.zonedDateTimeISO(timezone);
  }

  /**
   * Compare two Temporal.PlainDateTime objects
   * Returns: -1 if dt1 < dt2, 0 if equal, 1 if dt1 > dt2
   * Uses ISO string comparison as fallback for polyfills that don't have Temporal.PlainDateTime.compare
   */
  static compare(dt1: TemporalPlainDateTime, dt2: TemporalPlainDateTime): number {
    const Temporal = useTemporal();
    
    // Try using Temporal.PlainDateTime.compare if available
    if (Temporal.PlainDateTime && typeof Temporal.PlainDateTime.compare === 'function') {
      return Temporal.PlainDateTime.compare(dt1, dt2);
    }
    
    // Fallback: compare as ISO strings (which works for PlainDateTime)
    const iso1 = dt1.toString();
    const iso2 = dt2.toString();
    
    if (iso1 < iso2) return -1;
    if (iso1 > iso2) return 1;
    return 0;
  }
}
