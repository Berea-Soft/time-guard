/**
 * TimeGuard - Core Types and Interfaces
 * Following SOLID principles and TypeScript best practices
 *
 * Temporal types are provided natively by TypeScript (lib.esnext.temporal).
 */

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


