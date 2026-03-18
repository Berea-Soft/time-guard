/**
 * TimeGuard - Core Types and Interfaces
 * Following SOLID principles and TypeScript best practices
 */

// Global Temporal declarations
declare global {
  namespace Temporal {
    // Duration type
    class Duration {
      readonly years: number;
      readonly months: number;
      readonly weeks: number;
      readonly days: number;
      readonly hours: number;
      readonly minutes: number;
      readonly seconds: number;
      readonly milliseconds: number;
      readonly microseconds: number;
      readonly nanoseconds: number;
      static from(input: any): Duration;
      toString(): string;
    }

    // Instant type (nanosecond precision)
    class Instant {
      readonly epochMilliseconds: number;
      readonly epochNanoseconds: bigint;
      static from(input: any): Instant;
      static fromEpochMilliseconds(ms: number): Instant;
      static fromEpochNanoseconds(ns: bigint): Instant;
      toString(): string;
    }

    // Plain types
    class PlainDateTime {
      readonly year: number;
      readonly month: number;
      readonly day: number;
      readonly hour: number;
      readonly minute: number;
      readonly second: number;
      readonly millisecond: number;
      readonly microsecond: number;
      readonly nanosecond: number;
      readonly dayOfWeek: number;
      readonly dayOfYear: number;
      readonly weekOfYear: number;
      readonly yearOfWeek: number;
      readonly calendarId: string;
      static from(input: any): PlainDateTime;
      with(values: any): PlainDateTime;
      withCalendar(calendar: string): PlainDateTime;
      add(duration: any): PlainDateTime;
      subtract(duration: any): PlainDateTime;
      until(other: PlainDateTime, options?: any): Duration;
      since(other: PlainDateTime, options?: any): Duration;
      round(options: any): PlainDateTime;
      compare(other: PlainDateTime): number;
      equals(other: PlainDateTime): boolean;
      toZonedDateTime(timezone: string): ZonedDateTime;
      toPlainDate(): PlainDate;
      toPlainTime(): PlainTime;
      toInstant(): Instant;
      toString(): string;
      toJSON(): string;
      toLocaleString(locales?: string | string[], options?: any): string;
    }

    class ZonedDateTime {
      readonly year: number;
      readonly month: number;
      readonly day: number;
      readonly hour: number;
      readonly minute: number;
      readonly second: number;
      readonly millisecond: number;
      readonly microsecond: number;
      readonly nanosecond: number;
      readonly offset: string;
      readonly offsetNanoseconds: number;
      readonly timeZoneId: string;
      readonly calendarId: string;
      static from(input: any): ZonedDateTime;
      with(values: any): ZonedDateTime;
      withCalendar(calendar: string): ZonedDateTime;
      withTimeZone(timezone: string): ZonedDateTime;
      add(duration: any): ZonedDateTime;
      subtract(duration: any): ZonedDateTime;
      until(other: ZonedDateTime, options?: any): Duration;
      since(other: ZonedDateTime, options?: any): Duration;
      round(options: any): ZonedDateTime;
      compare(other: ZonedDateTime): number;
      equals(other: ZonedDateTime): boolean;
      toPlainDateTime(): PlainDateTime;
      toPlainDate(): PlainDate;
      toPlainTime(): PlainTime;
      toInstant(): Instant;
      startOfDay(): ZonedDateTime;
      toString(): string;
      toJSON(): string;
      toLocaleString(locales?: string | string[], options?: any): string;
    }

    class PlainDate {
      readonly year: number;
      readonly month: number;
      readonly day: number;
      readonly dayOfWeek: number;
      readonly dayOfYear: number;
      readonly weekOfYear: number;
      readonly yearOfWeek: number;
      readonly daysInMonth: number;
      readonly daysInYear: number;
      readonly monthsInYear: number;
      readonly inLeapYear: boolean;
      readonly calendarId: string;
      static from(input: any): PlainDate;
      with(values: any): PlainDate;
      withCalendar(calendar: string): PlainDate;
      add(duration: any): PlainDate;
      subtract(duration: any): PlainDate;
      until(other: PlainDate, options?: any): Duration;
      since(other: PlainDate, options?: any): Duration;
      compare(other: PlainDate): number;
      equals(other: PlainDate): boolean;
      toPlainDateTime(time?: any): PlainDateTime;
      toZonedDateTime(timezone: string, time?: any): ZonedDateTime;
      toString(): string;
      toJSON(): string;
      toLocaleString(locales?: string | string[], options?: any): string;
    }

    class PlainYearMonth {
      readonly year: number;
      readonly month: number;
      readonly calendarId: string;
      readonly daysInMonth: number;
      readonly daysInYear: number;
      readonly monthsInYear: number;
      readonly inLeapYear: boolean;
      static from(input: any): PlainYearMonth;
      with(values: any): PlainYearMonth;
      withCalendar(calendar: string): PlainYearMonth;
      add(duration: any): PlainYearMonth;
      subtract(duration: any): PlainYearMonth;
      until(other: PlainYearMonth): Duration;
      since(other: PlainYearMonth): Duration;
      compare(other: PlainYearMonth): number;
      equals(other: PlainYearMonth): boolean;
      toPlainDate(day?: number): PlainDate;
      toString(): string;
      toJSON(): string;
    }

    class PlainMonthDay {
      readonly month: number;
      readonly day: number;
      readonly calendarId: string;
      readonly daysInMonth: number;
      static from(input: any): PlainMonthDay;
      with(values: any): PlainMonthDay;
      withCalendar(calendar: string): PlainMonthDay;
      toPlainDate(year?: number): PlainDate;
      equals(other: PlainMonthDay): boolean;
      toString(): string;
      toJSON(): string;
    }

    class PlainTime {
      readonly hour: number;
      readonly minute: number;
      readonly second: number;
      readonly millisecond: number;
      readonly microsecond: number;
      readonly nanosecond: number;
      static from(input: any): PlainTime;
      with(values: any): PlainTime;
      add(duration: any): PlainTime;
      subtract(duration: any): PlainTime;
      until(other: PlainTime, options?: any): Duration;
      since(other: PlainTime, options?: any): Duration;
      round(options: any): PlainTime;
      compare(other: PlainTime): number;
      equals(other: PlainTime): boolean;
      toString(): string;
      toJSON(): string;
      toLocaleString(locales?: string | string[], options?: any): string;
    }

    namespace Now {
      function plainDateTimeISO(): PlainDateTime;
      function plainDateISO(): PlainDate;
      function plainTimeISO(): PlainTime;
      function zonedDateTimeISO(timezone?: string): ZonedDateTime;
      function instant(): Instant;
    }
  }
}

/**
 * Unit type for date/time operations
 */
export type Unit =
  | 'year'
  | 'month'
  | 'week'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'
  | 'millisecond'
  | 'microsecond'
  | 'nanosecond';

/**
 * Format preset strings for common patterns
 */
export type FormatPreset = 'iso' | 'date' | 'time' | 'datetime' | 'rfc2822' | 'rfc3339' | 'utc';

/**
 * Duration-like object for arithmetic operations
 */
export interface IDuration {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
  microseconds?: number;
  nanoseconds?: number;
}

/**
 * Round options for precision control
 */
export interface IRoundOptions {
  smallestUnit?: Unit;
  roundingMode?: 'ceil' | 'floor' | 'expand' | 'trunc' | 'halfExpand' | 'halfFloor' | 'halfCeil' | 'halfTrunc';
  roundingIncrement?: number;
}

/**
 * Calendar system interface
 */
export interface ICalendarSystem {
  id: string;
  name: string;
  locale?: string;
  getMonthName(month: number, short?: boolean): string;
  getWeekdayName(day: number, short?: boolean): string;
  isLeapYear(year: number): boolean;
  daysInMonth(year: number, month: number): number;
  daysInYear(year: number): number;
}

/**
 * Calendar manager interface
 */
export interface ICalendarManager {
  register(calendar: ICalendarSystem): void;
  get(id: string): ICalendarSystem | undefined;
  list(): string[];
  setDefault(id: string): void;
  getDefault(): ICalendarSystem;
}

/**
 * Locale configuration interface
 */
export interface ILocale {
  name: string;
  months: string[];
  monthsShort: string[];
  weekdays: string[];
  weekdaysShort: string[];
  weekdaysMin: string[];
  meridiem?: {
    am: string;
    pm: string;
  };
  formats?: Record<string, string>;
}

/**
 * Configuration options for TimeGuard instance
 */
export interface ITimeGuardConfig {
  locale?: string;
  timezone?: string;
  strict?: boolean;
}

/**
 * Interface for date/time parsing strategy (Strategy Pattern)
 */
export interface IDateParser {
  parse(input: unknown): any | null; // Temporal.PlainDateTime
  canHandle(input: unknown): boolean;
}

/**
 * Interface for date/time formatting (Strategy Pattern)
 */
export interface IDateFormatter {
  format(date: any, pattern: string): string; // Temporal.PlainDateTime
  getPreset(preset: FormatPreset): string;
}

/**
 * Interface for locale management (Single Responsibility)
 */
export interface ILocaleManager {
  setLocale(locale: string, data?: ILocale): void;
  getLocale(locale?: string): ILocale;
  listLocales(): string[];
}

/**
 * Interface for arithmetic operations
 */
export interface IDateArithmetic {
  add(units: Partial<Record<Unit, number>> | IDuration): TimeGuard;
  subtract(units: Partial<Record<Unit, number>> | IDuration): TimeGuard;
  diff(other: TimeGuard, unit?: Unit): number;
  until(other: TimeGuard, options?: IRoundOptions): IDuration;
  round(options: IRoundOptions): TimeGuard;
}

/**
 * Interface for query operations
 */
export interface IDateQuery {
  isBefore(other: TimeGuard): boolean;
  isAfter(other: TimeGuard): boolean;
  isSame(other: TimeGuard, unit?: Unit): boolean;
  isBetween(start: TimeGuard, end: TimeGuard, unit?: Unit, inclusivity?: '[)' | '()' | '[]' | '(]'): boolean;
}

/**
 * Interface for manipulation operations
 */
export interface IDateManipulation {
  clone(): TimeGuard;
  startOf(unit: Unit): TimeGuard;
  endOf(unit: Unit): TimeGuard;
  set(values: Partial<Record<Unit, number>>): TimeGuard;
  // Component getters
  year(): number;
  month(): number;
  day(): number;
  hour(): number;
  minute(): number;
  second(): number;
  millisecond(): number;
  dayOfWeek(): number;
  dayOfYear(): number;
  weekOfYear(): number;
  daysInMonth(): number;
  daysInYear(): number;
  inLeapYear(): boolean;
}

/**
 * Interface for timezone operations
 */
export interface ITimezoneAdapter {
  toTimezone(date: any, timezone: string): any; // Temporal.PlainDateTime -> Temporal.ZonedDateTime
  fromTimezone(date: any, targetTimezone: string): any; // Temporal.ZonedDateTime -> Temporal.PlainDateTime
  getOffset(timezone: string): number;
}

/**
 * Main TimeGuard interface (Facade Pattern)
 */
export interface ITimeGuard
  extends IDateArithmetic,
    IDateQuery,
    IDateManipulation {
  /**
   * Get the underlying Temporal date object
   */
  toTemporal(): any; // Temporal.PlainDateTime | Temporal.ZonedDateTime

  /**
   * Get as JavaScript Date (compatibility)
   */
  toDate(): Date;

  /**
   * Get as ISO string
   */
  toISOString(): string;

  /**
   * Get as Unix timestamp (milliseconds)
   */
  valueOf(): number;

  /**
   * Format the date with pattern or preset
   */
  format(pattern: string | FormatPreset): string;

  /**
   * Get accessor for components
   */
  get(component: Unit): number;

  /**
   * Locale of this instance
   */
  locale(): string;

  /**
   * Clone with new locale
   */
  locale(locale: string): TimeGuard;

  /**
   * Timezone info
   */
  timezone(): string | null;

  /**
   * Convert to another timezone
   */
  timezone(timezone: string): TimeGuard;

  /**
   * Get Unix timestamp in seconds
   */
  unix(): number;

  /**
   * Convert to JSON
   */
  toJSON(): string;

  /**
   * String representation
   */
  toString(): string;

  /**
   * Convert to PlainDate object
   */
  toPlainDate(): { year: number; month: number; day: number; dayOfWeek: number };

  /**
   * Convert to PlainTime object
   */
  toPlainTime(): { hour: number; minute: number; second: number; millisecond: number };

  /**
   * Get timezone offset (±HH:mm format or Z)
   */
  getOffset(): string;

  /**
   * Get timezone offset in nanoseconds
   */
  getOffsetNanoseconds(): number;

  /**
   * Get timezone ID
   */
  getTimeZoneId(): string | null;

  /**
   * Start of day
   */
  startOfDay(): TimeGuard;

  /**
   * End of day
   */
  endOfDay(): TimeGuard;

  /**
   * Duration from another date (inverse of until)
   */
  since(other: TimeGuard): IDuration;

  /**
   * ISO 8601 duration string (P1Y2M3DT4H5M6S)
   */
  toDurationString(other?: TimeGuard): string;

  /**
   * Check if in past
   */
  isPast(): boolean;

  /**
   * Check if in future
   */
  isFuture(): boolean;

  /**
   * Check if today
   */
  isToday(): boolean;

  /**
   * Check if tomorrow
   */
  isTomorrow(): boolean;

  /**
   * Check if yesterday
   */
  isYesterday(): boolean;
}

/**
 * Plugin interface for extending functionality
 */
export interface ITimeGuardPlugin {
  name: string;
  version: string;
  install(timeGuard: typeof TimeGuard, config?: unknown): void;
}

/**
 * Factory interface
 */
export interface ITimeGuardFactory {
  create(input?: unknown, config?: ITimeGuardConfig): ITimeGuard;
  now(config?: ITimeGuardConfig): ITimeGuard;
  fromTemporal(date: any, config?: ITimeGuardConfig): ITimeGuard; // Temporal.PlainDateTime | Temporal.ZonedDateTime
}

/**
 * Forward declaration for TimeGuard class
 * Implementation is in ./time-guard.ts, exported via ./index.ts
 */
export declare class TimeGuard {
  constructor(input?: unknown, config?: ITimeGuardConfig);
}


