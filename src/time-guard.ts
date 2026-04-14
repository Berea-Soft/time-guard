/**
 * TimeGuard - Main class implementing all interfaces
 * Facade Pattern: Provides unified interface for all time operations
 */

import type {
  ITimeGuard,
  ITimeGuardConfig,
  Unit,
  FormatPreset,
  IRoundOptions,
  IDurationOptions,
  IDiffResult,
  IDiffOptions,
  DurationParts,
  IDurationExplanation,
  IFormattableDuration,
} from './types';
import { TemporalAdapter } from './adapters/temporal.adapter';
import { DateFormatter } from './formatters/date.formatter';
import { Temporal } from '@js-temporal/polyfill';
import {
  formatZeroDuration,
  joinDurationParts,
  getDurationUnitLabel,
} from './utils/duration-locale';

type TemporalDateTime = Temporal.PlainDateTime | Temporal.ZonedDateTime;

// Time conversion constants (hoisted to avoid recalculation)
const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = MS_PER_SECOND * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;
const MS_PER_WEEK = MS_PER_DAY * 7;
const DAYS_PER_YEAR = 365.25;
const DAYS_PER_MONTH = DAYS_PER_YEAR / 12;
const MS_PER_MONTH = DAYS_PER_MONTH * MS_PER_DAY;
const MS_PER_YEAR = DAYS_PER_YEAR * MS_PER_DAY;

// Hoisted constants
const ZERO_DIFF_DAYS = ' days';

/**
 * Calculate total milliseconds from duration parts using hoisted constants
 */
function calculateTotalMs(duration: any): number {
  return (
    (duration.years || 0) * MS_PER_YEAR +
    (duration.months || 0) * MS_PER_MONTH +
    (duration.weeks || 0) * MS_PER_WEEK +
    (duration.days || 0) * MS_PER_DAY +
    (duration.hours || 0) * MS_PER_HOUR +
    (duration.minutes || 0) * MS_PER_MINUTE +
    (duration.seconds || 0) * MS_PER_SECOND +
    (duration.milliseconds || 0)
  );
}

/**
 * Diff result object that allows chaining with .as()
 *
 * Supports two modes:
 * - 'exact': Returns precise time differences
 * - 'calendar': Returns calendar-aware breakdown
 */
class DiffResult implements IDiffResult, IFormattableDuration {
  private _value: number;
  private _tg1: TimeGuard;
  private _tg2: TimeGuard;
  private _mode: 'calendar' | 'exact';
  private _breakdownData: DurationParts | null;
  private _locale: string;

  constructor(
    value: number,
    tg1: TimeGuard,
    tg2: TimeGuard,
    mode: 'calendar' | 'exact' = 'exact',
    breakdownData?: DurationParts,
    locale?: string
  ) {
    this._value = value;
    this._tg1 = tg1;
    this._tg2 = tg2;
    this._mode = mode;
    this._breakdownData = breakdownData || null;
    this._locale = locale || 'en';
  }

  as(unit: Unit): number {
    return this._tg1.diff(this._tg2, unit);
  }

  breakdown(): DurationParts | null {
    return this._breakdownData;
  }

  format(locale?: string): string {
    const l = locale || this._locale;

    if (!this._breakdownData) {
      // Fallback for exact mode - show in days
      return `${Math.abs(this._tg1.diff(this._tg2, 'day'))}${ZERO_DIFF_DAYS}`;
    }

    const parts: string[] = [];
    const bd = this._breakdownData;

    // Build parts array in logical order
    if (bd.years !== 0) parts.push(`${bd.years} ${getDurationUnitLabel('year', l, bd.years)}`);
    if (bd.months !== 0) parts.push(`${bd.months} ${getDurationUnitLabel('month', l, bd.months)}`);
    if (bd.weeks !== 0) parts.push(`${bd.weeks} ${getDurationUnitLabel('week', l, bd.weeks)}`);
    if (bd.days !== 0) parts.push(`${bd.days} ${getDurationUnitLabel('day', l, bd.days)}`);
    if (bd.hours !== 0) parts.push(`${bd.hours} ${getDurationUnitLabel('hour', l, bd.hours)}`);
    if (bd.minutes !== 0) parts.push(`${bd.minutes} ${getDurationUnitLabel('minute', l, bd.minutes)}`);
    if (bd.seconds !== 0) parts.push(`${bd.seconds} ${getDurationUnitLabel('second', l, bd.seconds)}`);

    if (parts.length === 0) return formatZeroDuration(l);

    return joinDurationParts(parts, l);
  }

  getMode(): 'calendar' | 'exact' {
    return this._mode;
  }

  valueOf(): number {
    return this._value;
  }

  toString(): string {
    if (this._mode === 'calendar' && this._breakdownData) {
      return this.format();
    }
    return this._value.toString();
  }

  toJSON(): number {
    return this._value;
  }
}

/**
 * DurationResult class - Represents a duration breakdown with humanize support
 * Returned by until(), since(), and between() methods
 */
export class DurationResult implements DurationParts, IFormattableDuration {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  private _locale: string;
  private _startDate?: string;
  private _endDate?: string;
  private _steps: string[] = [];
  private _mode: 'exact' | 'estimated' = 'exact';
  private _leapYearFlags: Array<{ year: number; isLeap: boolean; daysInFebruary: number }> = [];
  private _calculationTimeMs: number = 0;

  constructor(
    parts: DurationParts,
    locale: string = 'en',
    metadata?: {
      startDate?: string;
      endDate?: string;
      steps?: string[];
      mode?: 'exact' | 'estimated';
      leapYearFlags?: Array<{ year: number; isLeap: boolean; daysInFebruary: number }>;
      calculationTimeMs?: number;
    }
  ) {
    this.years = parts.years;
    this.months = parts.months;
    this.weeks = parts.weeks;
    this.days = parts.days;
    this.hours = parts.hours;
    this.minutes = parts.minutes;
    this.seconds = parts.seconds;
    this.milliseconds = parts.milliseconds;
    this._locale = locale;

    if (metadata) {
      this._startDate = metadata.startDate;
      this._endDate = metadata.endDate;
      this._steps = metadata.steps || [];
      this._mode = metadata.mode || 'exact';
      this._leapYearFlags = metadata.leapYearFlags || [];
      this._calculationTimeMs = metadata.calculationTimeMs || 0;
    }
  }

  humanize(options?: {
    locale?: string;
    fullBreakdown?: boolean;
    numeric?: 'always' | 'auto';
  }): string {
    const locale = options?.locale || this._locale;
    const fullBreakdown = options?.fullBreakdown ?? false;
    const numeric = options?.numeric ?? 'always';

    const parts = [
      { unit: 'year', value: this.years },
      { unit: 'month', value: this.months },
      { unit: 'week', value: this.weeks },
      { unit: 'day', value: this.days },
      { unit: 'hour', value: this.hours },
      { unit: 'minute', value: this.minutes },
      { unit: 'second', value: this.seconds },
      { unit: 'millisecond', value: this.milliseconds },
    ];

    const nonZeroParts = parts.filter(p => p.value > 0);

    if (nonZeroParts.length === 0) {
      return '0 seconds';
    }

    if (!fullBreakdown || nonZeroParts.length === 1) {
      const largest = nonZeroParts[0];
      try {
        const rtf = new Intl.RelativeTimeFormat(locale, { numeric, style: 'long' });
        return rtf.format(largest.value, largest.unit as any);
      } catch {
        return `${largest.value} ${this.pluralizeUnit(largest.unit, largest.value, locale)}`;
      }
    }

    const formatted = nonZeroParts.map((p) => {
      const label = getDurationUnitLabel(p.unit, locale, p.value);
      return `${p.value} ${label}`;
    });

    return joinDurationParts(formatted, locale);
  }

  total(unit: Unit): number {
    let totalMs = 0;
    totalMs += this.years * MS_PER_YEAR;
    totalMs += this.months * MS_PER_MONTH;
    totalMs += this.weeks * MS_PER_WEEK;
    totalMs += this.days * MS_PER_DAY;
    totalMs += this.hours * MS_PER_HOUR;
    totalMs += this.minutes * MS_PER_MINUTE;
    totalMs += this.seconds * MS_PER_SECOND;
    totalMs += this.milliseconds;

    switch (unit) {
      case 'millisecond':
        return totalMs;
      case 'second':
        return totalMs / MS_PER_SECOND;
      case 'minute':
        return totalMs / MS_PER_MINUTE;
      case 'hour':
        return totalMs / MS_PER_HOUR;
      case 'day':
        return totalMs / MS_PER_DAY;
      case 'week':
        return totalMs / MS_PER_WEEK;
      case 'month':
        return totalMs / MS_PER_MONTH;
      case 'year':
        return totalMs / MS_PER_YEAR;
      case 'microsecond':
        return totalMs * 1000; // milliseconds to microseconds
      case 'nanosecond':
        return totalMs * 1_000_000;
      default:
        throw new Error(`Unsupported unit: ${unit}`);
    }
  }

  toString(): string {
    return this.humanize({ fullBreakdown: true });
  }

  toJSON(): Record<string, number> {
    return {
      years: this.years,
      months: this.months,
      weeks: this.weeks,
      days: this.days,
      hours: this.hours,
      minutes: this.minutes,
      seconds: this.seconds,
      milliseconds: this.milliseconds,
    };
  }

  explain(): IDurationExplanation {
    let steps = [...this._steps];

    if (steps.length === 0) {
      steps = this.generateExplanationSteps();
    }

    const explanationParts: string[] = [];

    if (this._startDate && this._endDate) {
      explanationParts.push(`Calculated duration from ${this._startDate} to ${this._endDate}`);
    }

    if (this._leapYearFlags && this._leapYearFlags.length > 0) {
      const leapYears = this._leapYearFlags.filter(f => f.isLeap).map(f => f.year);
      if (leapYears.length > 0) {
        explanationParts.push(`Leap year(s) detected: ${leapYears.join(', ')}`);
      }
    }

    explanationParts.push(`Breakdown: ${this.years} year(s), ${this.months} month(s), ${this.days} day(s)`);
    explanationParts.push(`Mode: ${this._mode} calculation`);

    return {
      input: this._startDate && this._endDate ? [this._startDate, this._endDate] : [],
      steps,
      breakdown: {
        years: this.years,
        months: this.months,
        weeks: this.weeks,
        days: this.days,
        hours: this.hours,
        minutes: this.minutes,
        seconds: this.seconds,
        milliseconds: this.milliseconds,
      },
      mode: this._mode,
      explanation: explanationParts.join('. '),
      locale: this._locale,
      leapYearFlags: this._leapYearFlags.length > 0 ? this._leapYearFlags : undefined,
      metadata: {
        calculationTimeMs: this._calculationTimeMs,
        precision: 'day',
      },
    };
  }

  private generateExplanationSteps(): string[] {
    const steps: string[] = [];

    if (this._startDate && this._endDate) {
      steps.push(`Input: ${this._startDate} to ${this._endDate}`);
    } else {
      steps.push('Duration calculation started');
    }

    // Add component breakdown
    if (this.years > 0) {
      steps.push(`Years: ${this.years}`);
    }
    if (this.months > 0) {
      steps.push(`Months: ${this.months}`);
    }
    if (this.weeks > 0) {
      steps.push(`Weeks: ${this.weeks}`);
    }
    if (this.days > 0) {
      steps.push(`Days: ${this.days}`);
    }
    if (this.hours > 0) {
      steps.push(`Hours: ${this.hours}`);
    }
    if (this.minutes > 0) {
      steps.push(`Minutes: ${this.minutes}`);
    }
    if (this.seconds > 0) {
      steps.push(`Seconds: ${this.seconds}`);
    }
    if (this.milliseconds > 0) {
      steps.push(`Milliseconds: ${this.milliseconds}`);
    }

    if (this._leapYearFlags && this._leapYearFlags.length > 0) {
      for (const flag of this._leapYearFlags) {
        if (flag.isLeap) {
          steps.push(`${flag.year} is a leap year (February has ${flag.daysInFebruary} days)`);
        }
      }
    }

    const totalParts = [
      this.years > 0 ? `${this.years}y` : '',
      this.months > 0 ? `${this.months}m` : '',
      this.days > 0 ? `${this.days}d` : '',
      this.hours > 0 ? `${this.hours}h` : '',
      this.minutes > 0 ? `${this.minutes}min` : '',
      this.seconds > 0 ? `${this.seconds}s` : '',
    ]
      .filter(p => p.length > 0)
      .join(' ');

    steps.push(`Total: ${totalParts || '0'}`);

    return steps;
  }

  private pluralizeUnit(unit: string, count: number, locale: string): string {
    return getDurationUnitLabel(unit, locale, count);
  }
}

/**
 * TimeGuard implementation - Main facade class
 */
/**
 * TimeRange - Fluent API for date range operations
 *
 * @example
 * TimeGuard.range('2024-01-15', '2024-03-20')
 *   .toDuration().humanize()        // "2 months and 5 days"
 *   .inMonths()                     // 2.1355 (precise decimal)
 */
export class TimeRange {
  private _start: TimeGuard;
  private _end: TimeGuard;

  constructor(start: TimeGuard, end: TimeGuard) {
    this._start = start;
    this._end = end;
  }

  toDuration(): DurationResult {
    return TimeGuard.between(this._start, this._end);
  }

  inMonths(): number {
    return this.toDuration().total('month');
  }

  humanize(options?: {
    locale?: string;
    fullBreakdown?: boolean;
    numeric?: 'always' | 'auto';
  }): string {
    return this.toDuration().humanize(options);
  }

  in(unit: Unit): number {
    return this.toDuration().total(unit);
  }
}

export class TimeGuard implements ITimeGuard {
  private temporal: TemporalDateTime;
  private config: Required<ITimeGuardConfig>;
  private formatterInstance: DateFormatter;

  private static readonly ZERO_DURATION: DurationParts = {
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  };

  private static isLeapYearValue(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  private static toDurationParts(duration: any): DurationParts {
    return {
      years: Math.floor(duration.years || 0),
      months: Math.floor(duration.months || 0),
      weeks: Math.floor(duration.weeks || 0),
      days: Math.floor(duration.days || 0),
      hours: Math.floor(duration.hours || 0),
      minutes: Math.floor(duration.minutes || 0),
      seconds: Math.floor(duration.seconds || 0),
      milliseconds: Math.floor(duration.milliseconds || 0),
    };
  }

  constructor(input?: unknown, config?: ITimeGuardConfig) {
    this.formatterInstance = new DateFormatter();

    this.config = {
      locale: config?.locale || 'en',
      timezone: config?.timezone || 'UTC',
      strict: config?.strict ?? false,
    };

    this.temporal = TemporalAdapter.parseToPlainDateTime(input);

    // Convert to ZonedDateTime if timezone is specified
    if (this.config.timezone && this.config.timezone !== 'UTC') {
      try {
        this.temporal = (this.temporal as any).toZonedDateTime(this.config.timezone);
      } catch {
        // Keep as PlainDateTime if timezone conversion fails
      }
    }
  }

  static now(config?: ITimeGuardConfig): TimeGuard {
    return new TimeGuard(undefined, config);
  }

  static from(input: unknown, config?: ITimeGuardConfig): TimeGuard {
    return new TimeGuard(input, config);
  }

  static fromTemporal(
    temporal: any, // Temporal.PlainDateTime | Temporal.ZonedDateTime
    config?: ITimeGuardConfig,
  ): TimeGuard {
    const instance = new TimeGuard(undefined, config);
    instance.temporal = temporal;
    return instance;
  }

  /**
   * Calculate duration between two dates - always returns positive duration
   *
   * @example
   * TimeGuard.between(start, end).humanize() // "2 months and 5 days"
   * TimeGuard.between(end, start).humanize() // "2 months and 5 days" (still positive)
   */
  static between(date1: TimeGuard, date2: TimeGuard): DurationResult {
    const t1 = TemporalAdapter.toPlainDateTime(date1.temporal);
    const t2 = TemporalAdapter.toPlainDateTime(date2.temporal);

    const [earlier, later] = TemporalAdapter.compare(t1, t2) <= 0
      ? [date1, date2]
      : [date2, date1];

    return earlier.until(later);
  }

  /**
   * Create a TimeRange for fluent duration calculations
   *
   * @example
   * TimeGuard.range("2024-01-15", "2024-03-20").humanize() // "2 months and 5 days"
   */
  static range(start: unknown, end: unknown): TimeRange {
    const startTg = start instanceof TimeGuard ? start : new TimeGuard(start);
    const endTg = end instanceof TimeGuard ? end : new TimeGuard(end);
    return new TimeRange(startTg, endTg);
  }

  toTemporal(): any {
    return this.temporal;
  }

  toDate(): Date {
    return TemporalAdapter.toDate(this.temporal);
  }

  toISOString(): string {
    return TemporalAdapter.toISOString(this.temporal);
  }

  valueOf(): number {
    return TemporalAdapter.toUnix(this.temporal);
  }

  unix(): number {
    return Math.floor(this.valueOf() / 1000);
  }

  toJSON(): string {
    return this.toISOString();
  }

  toString(): string {
    return this.format('YYYY-MM-DD HH:mm:ss');
  }

  locale(): string;
  locale(locale: string): TimeGuard;
  locale(locale?: string): string | TimeGuard {
    if (locale === undefined) {
      return this.config.locale;
    }
    const cloned = this.clone();
    cloned.config.locale = locale;
    return cloned;
  }

  timezone(): string | null;
  timezone(timezone: string): TimeGuard;
  timezone(timezone?: string): string | null | TimeGuard {
    if (timezone === undefined) {
      return this.config.timezone;
    }
    const cloned = this.clone();
    cloned.config.timezone = timezone;
    try {
      const plainDT = TemporalAdapter.toPlainDateTime(cloned.temporal);
      cloned.temporal = (plainDT as any).toZonedDateTime(timezone);
    } catch {
      // Keep as PlainDateTime if timezone conversion fails
    }
    return cloned;
  }

  format(pattern: string | FormatPreset): string {
    const plainDT = TemporalAdapter.toPlainDateTime(this.temporal);
    const knownPresets = ['iso', 'date', 'time', 'datetime', 'rfc2822', 'rfc3339', 'utc'];
    const formatPattern = knownPresets.includes(pattern as string)
      ? this.formatterInstance.getPreset(pattern as FormatPreset)
      : (pattern as string);
    return this.formatterInstance.format(plainDT, formatPattern, this.config.locale);
  }

  get(component: Unit): number {
    const plainDT = TemporalAdapter.toPlainDateTime(this.temporal);

    const unitMap: Record<Unit, string> = {
      year: 'year',
      month: 'month',
      week: 'year', // Special handling below
      day: 'day',
      hour: 'hour',
      minute: 'minute',
      second: 'second',
      millisecond: 'millisecond',
      microsecond: 'microsecond',
      nanosecond: 'nanosecond',
    };

    if (component === 'week') {
      return (plainDT as any).weekOfYear;
    }

    return (plainDT as Record<string, any>)[unitMap[component]] as number;
  }

  add(units: Partial<Record<Unit, number>>): TimeGuard {
    let plainDT = TemporalAdapter.toPlainDateTime(this.temporal);

    const duration: any = {};
    Object.entries(units).forEach(([unit, value]) => {
      if (value !== undefined && value !== 0) {
        duration[unit + 's'] = value;
      }
    });

    plainDT = (plainDT as any).add(duration);
    return TimeGuard.fromTemporal(plainDT, this.config);
  }

  subtract(units: Partial<Record<Unit, number>>): TimeGuard {
    const negated: Partial<Record<Unit, number>> = {};
    Object.entries(units).forEach(([unit, value]) => {
      negated[unit as Unit] = value ? -value : 0;
    });
    return this.add(negated);
  }

  // Overloaded signatures for diff()
  /**
   * Calculate difference between two TimeGuard instances
   * 
   * Supports multiple modes:
   * 1. diff(other) - Returns DiffResult with fluent API (default: exact mode)
   * 2. diff(other, unit) - Returns number (backward compatible)
   * 3. diff(other, options) - Returns DiffResult with calendar or exact mode
   * 
   * @example
   * // Exact mode (default)
   * tg1.diff(tg2).as('day') // 65
   * // Calendar mode
   * tg1.diff(tg2, { mode: 'calendar' }).format('en') // "2 months and 5 days"
   */
  diff(other: TimeGuard): DiffResult;
  diff(other: TimeGuard, unit: Unit): number;
  diff(other: TimeGuard, options: IDiffOptions): DiffResult;
  diff(
    other: TimeGuard,
    unitOrOptions?: Unit | IDiffOptions
  ): DiffResult | number {
    const plainDT1 = TemporalAdapter.toPlainDateTime(this.temporal);
    const plainDT2 = TemporalAdapter.toPlainDateTime(other.temporal);

    const unitMap: Record<Unit, string> = {
      year: 'years',
      month: 'months',
      week: 'weeks',
      day: 'days',
      hour: 'hours',
      minute: 'minutes',
      second: 'seconds',
      millisecond: 'milliseconds',
      microsecond: 'microseconds',
      nanosecond: 'nanoseconds',
    };

    if (typeof unitOrOptions === 'string') {
      const unit = unitOrOptions;
      const mappedUnit = unitMap[unit];
      const duration = (plainDT1 as any).since(plainDT2, { smallestUnit: unit });
      return Math.round((duration as any)[mappedUnit] || 0);
    }

    const options = (unitOrOptions as IDiffOptions) || {};
    const mode = options.mode || 'exact';
    const unit = options.unit || 'millisecond';
    const locale = options.locale || this.config.locale;

    if (mode === 'exact') {
      const mappedUnit = unitMap[unit];
      const duration = (plainDT1 as any).since(plainDT2, { smallestUnit: unit });
      const result = Math.round((duration as any)[mappedUnit] || 0);

      if (unitOrOptions === undefined || typeof unitOrOptions === 'object') {
        const totalMs = calculateTotalMs(duration);
        return new DiffResult(Math.round(totalMs), this, other, mode, undefined, locale);
      }

      return result;
    }

    if (mode === 'calendar') {
      const duration = (plainDT1 as any).since(plainDT2, {
        largestUnit: 'month',
        smallestUnit: 'millisecond'
      });

      const breakdownData: DurationParts = {
        years: Math.floor(duration.years || 0),
        months: Math.floor(duration.months || 0),
        weeks: Math.floor(duration.weeks || 0),
        days: Math.floor(duration.days || 0),
        hours: Math.floor(duration.hours || 0),
        minutes: Math.floor(duration.minutes || 0),
        seconds: Math.floor(duration.seconds || 0),
        milliseconds: Math.floor(duration.milliseconds || 0),
      };

      const totalMs = calculateTotalMs(duration);
      return new DiffResult(Math.round(totalMs), this, other, mode, breakdownData, locale);
    }

    const duration = (plainDT1 as any).since(plainDT2, { smallestUnit: 'millisecond' });
    const totalMs = calculateTotalMs(duration);
    return new DiffResult(Math.round(totalMs), this, other, mode, undefined, locale);
  }

  isBefore(other: TimeGuard): boolean {
    const plainDT1 = TemporalAdapter.toPlainDateTime(this.temporal);
    const plainDT2 = TemporalAdapter.toPlainDateTime(other.temporal);
    return TemporalAdapter.compare(plainDT1, plainDT2) < 0;
  }

  isAfter(other: TimeGuard): boolean {
    const plainDT1 = TemporalAdapter.toPlainDateTime(this.temporal);
    const plainDT2 = TemporalAdapter.toPlainDateTime(other.temporal);
    return TemporalAdapter.compare(plainDT1, plainDT2) > 0;
  }

  isSame(other: TimeGuard, unit?: Unit): boolean {
    if (!unit) {
      return TemporalAdapter.compare(
        TemporalAdapter.toPlainDateTime(this.temporal),
        TemporalAdapter.toPlainDateTime(other.temporal),
      ) === 0;
    }

    const plainDT1 = TemporalAdapter.toPlainDateTime(this.temporal);
    const plainDT2 = TemporalAdapter.toPlainDateTime(other.temporal);

    switch (unit) {
      case 'year':
        return plainDT1.year === plainDT2.year;
      case 'month':
        return plainDT1.year === plainDT2.year && plainDT1.month === plainDT2.month;
      case 'day':
        return (
          plainDT1.year === plainDT2.year
          && plainDT1.month === plainDT2.month
          && plainDT1.day === plainDT2.day
        );
      case 'hour':
        return (
          plainDT1.year === plainDT2.year
          && plainDT1.month === plainDT2.month
          && plainDT1.day === plainDT2.day
          && plainDT1.hour === plainDT2.hour
        );
      case 'minute':
        return (
          plainDT1.year === plainDT2.year
          && plainDT1.month === plainDT2.month
          && plainDT1.day === plainDT2.day
          && plainDT1.hour === plainDT2.hour
          && plainDT1.minute === plainDT2.minute
        );
      case 'second':
        return (
          plainDT1.year === plainDT2.year
          && plainDT1.month === plainDT2.month
          && plainDT1.day === plainDT2.day
          && plainDT1.hour === plainDT2.hour
          && plainDT1.minute === plainDT2.minute
          && plainDT1.second === plainDT2.second
        );
      default:
        return false;
    }
  }

  isBetween(
    start: TimeGuard,
    end: TimeGuard,
    unit?: Unit,
    inclusivity: '[)' | '()' | '[]' | '(]' = '[]',
  ): boolean {
    const plainDT = TemporalAdapter.toPlainDateTime(this.temporal);
    const plainStart = TemporalAdapter.toPlainDateTime(start.temporal);
    const plainEnd = TemporalAdapter.toPlainDateTime(end.temporal);

    let afterStart = true;
    let beforeEnd = true;

    if (unit) {
      // Compare only up to the specified unit
      const startCopy = this.clone().startOf(unit);
      const endCopy = this.clone().endOf(unit);
      const plainCopy = TemporalAdapter.toPlainDateTime(startCopy.temporal);
      const plainEndCopy = TemporalAdapter.toPlainDateTime(endCopy.temporal);

      afterStart = TemporalAdapter.compare(plainCopy, plainStart) >= 0;
      beforeEnd = TemporalAdapter.compare(plainEndCopy, plainEnd) <= 0;
    } else {
      afterStart = TemporalAdapter.compare(plainDT, plainStart) >= 0;
      beforeEnd = TemporalAdapter.compare(plainDT, plainEnd) <= 0;
    }

    const hasStartBracket = inclusivity[0] === '[';
    const hasEndBracket = inclusivity[1] === ']';

    return (hasStartBracket ? afterStart : TemporalAdapter.compare(plainDT, plainStart) > 0)
      && (hasEndBracket ? beforeEnd : TemporalAdapter.compare(plainDT, plainEnd) < 0);
  }

  // ===== Manipulation methods =====

  clone(): TimeGuard {
    return new TimeGuard(this.toDate(), this.config);
  }

  startOf(unit: Unit): TimeGuard {
    const plainDT = TemporalAdapter.toPlainDateTime(this.temporal);

    const values: Partial<Record<Unit, number>> = {};

    switch (unit) {
      case 'year':
        values.month = 1;
        values.day = 1;
        values.hour = 0;
        values.minute = 0;
        values.second = 0;
        values.millisecond = 0;
        break;
      case 'month':
        values.day = 1;
        values.hour = 0;
        values.minute = 0;
        values.second = 0;
        values.millisecond = 0;
        break;
      case 'week':
      case 'day':
        values.hour = 0;
        values.minute = 0;
        values.second = 0;
        values.millisecond = 0;
        break;
      case 'hour':
        values.minute = 0;
        values.second = 0;
        values.millisecond = 0;
        break;
      case 'minute':
        values.second = 0;
        values.millisecond = 0;
        break;
      case 'second':
        values.millisecond = 0;
        break;
    }

    const updated = (plainDT as any).with(values);
    return TimeGuard.fromTemporal(updated, this.config);
  }

  endOf(unit: Unit): TimeGuard {
    const start = this.startOf(unit);
    const next = start.add({ [unit]: 1 } as any).subtract({ millisecond: 1 });
    return next;
  }

  set(values: Partial<Record<Unit, number>>): TimeGuard {
    const plainDT = TemporalAdapter.toPlainDateTime(this.temporal);
    const updated = (plainDT as any).with(values);
    return TimeGuard.fromTemporal(updated, this.config);
  }

  // ===== Component getter methods =====

  year(): number {
    return TemporalAdapter.toPlainDateTime(this.temporal).year;
  }

  month(): number {
    return TemporalAdapter.toPlainDateTime(this.temporal).month;
  }

  day(): number {
    return TemporalAdapter.toPlainDateTime(this.temporal).day;
  }

  hour(): number {
    return TemporalAdapter.toPlainDateTime(this.temporal).hour;
  }

  minute(): number {
    return TemporalAdapter.toPlainDateTime(this.temporal).minute;
  }

  second(): number {
    return TemporalAdapter.toPlainDateTime(this.temporal).second;
  }

  millisecond(): number {
    return TemporalAdapter.toPlainDateTime(this.temporal).millisecond;
  }

  dayOfWeek(): number {
    return (TemporalAdapter.toPlainDateTime(this.temporal) as any).dayOfWeek;
  }

  dayOfYear(): number {
    return (TemporalAdapter.toPlainDateTime(this.temporal) as any).dayOfYear;
  }

  weekOfYear(): number {
    return (TemporalAdapter.toPlainDateTime(this.temporal) as any).weekOfYear;
  }

  daysInMonth(): number {
    const plainDT = TemporalAdapter.toPlainDateTime(this.temporal);
    const nextMonth = (plainDT as any).add({ months: 1 }).with({ day: 1 });
    const lastDay = (nextMonth as any).subtract({ days: 1 });
    return lastDay.day;
  }

  daysInYear(): number {
    const year = this.year();
    return TimeGuard.isLeapYearValue(year) ? 366 : 365;
  }

  inLeapYear(): boolean {
    const plainDT = TemporalAdapter.toPlainDateTime(this.temporal);
    return TimeGuard.isLeapYearValue(plainDT.year);
  }

  // ===== Duration and Rounding methods =====

  /**
   * Calculate duration until another TimeGuard
   * @returns Duration object with .humanize() and other methods
   * @example
   * start.until(end).humanize() // "2 months and 5 days"
   * start.until(end).humanize({ fullBreakdown: true, locale: 'es' }) // "2 meses y 5 días"
   */
  until(other: TimeGuard, options?: IDurationOptions): DurationResult {
    const plainDT1 = TemporalAdapter.toPlainDateTime(this.temporal);
    const plainDT2 = TemporalAdapter.toPlainDateTime(other.temporal);

    const startTime = performance.now();

    try {
      // Pass largestUnit and smallestUnit to Temporal.since() for proper normalization
      const temporalOptions: any = {};
      if (options?.largestUnit) {
        temporalOptions.largestUnit = options.largestUnit;
      }
      if (options?.smallestUnit) {
        temporalOptions.smallestUnit = options.smallestUnit;
      }
      const duration = (plainDT2 as any).since(plainDT1, Object.keys(temporalOptions).length > 0 ? temporalOptions : undefined);
      const parts = TimeGuard.toDurationParts(duration);
      
      // Collect leap year information for explanation
      const startYear = plainDT1.year;
      const endYear = plainDT2.year;
      const leapYearFlags: Array<{ year: number; isLeap: boolean; daysInFebruary: number }> = [];

      for (let year = startYear; year <= endYear; year++) {
        const isLeap = TimeGuard.isLeapYearValue(year);
        leapYearFlags.push({
          year,
          isLeap,
          daysInFebruary: isLeap ? 29 : 28,
        });
      }

      // Generate explanation steps
      const steps = this.generateUntilSteps(plainDT1, plainDT2, parts, leapYearFlags);

      const endTime = performance.now();
      const calculationTimeMs = endTime - startTime;

      // Return DurationResult with full metadata
      return new DurationResult(parts, this.config.locale, {
        startDate: plainDT1.toString(),
        endDate: plainDT2.toString(),
        steps,
        mode: 'exact',
        leapYearFlags: leapYearFlags.filter(f => f.isLeap),
        calculationTimeMs,
      });
    } catch {
      return new DurationResult(TimeGuard.ZERO_DURATION, this.config.locale, {
        startDate: plainDT1.toString(),
        endDate: plainDT2.toString(),
        steps: ['Calculation failed, returning zero duration'],
        mode: 'estimated',
      });
    }
  }

  /**
   * Generate explanation steps for until() calculation
   */
  private generateUntilSteps(
    start: any,
    end: any,
    parts: DurationParts,
    leapYearFlags: Array<{ year: number; isLeap: boolean; daysInFebruary: number }>
  ): string[] {
    const steps: string[] = [];

    // Input summary
    steps.push(`Parsed dates: ${start.year}-${String(start.month).padStart(2, '0')}-${String(start.day).padStart(2, '0')} (day ${start.dayOfYear} of ${TimeGuard.isLeapYearValue(start.year) ? 366 : 365})`);
    steps.push(`to ${end.year}-${String(end.month).padStart(2, '0')}-${String(end.day).padStart(2, '0')} (day ${end.dayOfYear} of ${TimeGuard.isLeapYearValue(end.year) ? 366 : 365})`);

    // Leap year information
    const leapYearsInRange = leapYearFlags.filter(f => f.isLeap);
    if (leapYearsInRange.length > 0) {
      for (const flag of leapYearsInRange) {
        steps.push(`${flag.year} is a leap year (February has ${flag.daysInFebruary} days)`);
      }
    }

    // Breakdown explanation
    if (parts.years > 0) {
      steps.push(`Years: ${parts.years}`);
    }
    if (parts.months > 0) {
      steps.push(`Months: ${parts.months}`);
    }
    if (parts.days > 0) {
      steps.push(`Days: ${parts.days}`);
    }
    if (parts.hours > 0 || parts.minutes > 0 || parts.seconds > 0) {
      const timeComponents = [];
      if (parts.hours > 0) timeComponents.push(`${parts.hours}h`);
      if (parts.minutes > 0) timeComponents.push(`${parts.minutes}m`);
      if (parts.seconds > 0) timeComponents.push(`${parts.seconds}s`);
      steps.push(`Time: ${timeComponents.join(' ')}`);
    }

    // Total summary
    const totalDays = (parts.years * 365.25) + (parts.months * 30.4375) + parts.days + (parts.hours / 24);
    steps.push(`Total: approximately ${totalDays.toFixed(2)} days`);

    return steps;
  }

  /**
   * Round to a specific unit with optional rounding mode
   */
  round(options: IRoundOptions = {}): TimeGuard {
    const { smallestUnit = 'millisecond', roundingMode = 'halfExpand' } = options;
    const plainDT = TemporalAdapter.toPlainDateTime(this.temporal);

    const unitValues: Record<Unit, number> = {
      year: plainDT.year,
      month: plainDT.month,
      day: plainDT.day,
      hour: plainDT.hour,
      minute: plainDT.minute,
      second: plainDT.second,
      millisecond: plainDT.millisecond,
      microsecond: (plainDT as any).microsecond || 0,
      nanosecond: (plainDT as any).nanosecond || 0,
      week: 0, // Not directly roundable
    };

    const unitOrder: Unit[] = ['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond', 'microsecond', 'nanosecond'];
    const smallestIndex = unitOrder.indexOf(smallestUnit);

    if (smallestIndex === -1) {
      return this.clone();
    }

    // Build rounded values: include all units up to and including smallestUnit
    const roundedValues: Partial<Record<Unit, number>> = {};

    for (let i = 0; i < smallestIndex; i++) {
      const unit = unitOrder[i];
      roundedValues[unit as Unit] = unitValues[unit];
    }

    // Process the smallest unit with rounding
    const unit = unitOrder[smallestIndex];
    let value = unitValues[unit];

    // Apply rounding mode
    if (smallestIndex + 1 < unitOrder.length) {
      const nextUnitValue = unitValues[unitOrder[smallestIndex + 1]];
      
      // Temporal API rounding modes
      const shouldRoundUp = (mode: string, nextVal: number): boolean => {
        switch (mode) {
          case 'ceil':
            return nextVal > 0;
          case 'floor':
          case 'trunc':
            return false;
          case 'halfExpand':
          case 'halfFloor':
          case 'halfCeil':
            return nextVal >= 5;
          case 'expand':
            return nextVal > 0;
          default:
            return nextVal >= 5;
        }
      };

      if (shouldRoundUp(roundingMode, nextUnitValue)) {
        value += 1;
      }
    }

    roundedValues[unit as Unit] = value;
    
    // Set all smaller units to 0
    for (let i = smallestIndex + 1; i < unitOrder.length; i++) {
      roundedValues[unitOrder[i] as Unit] = 0;
    }

    return this.set(roundedValues);
  }

  // ===== Conversion methods =====

  /**
   * Convert to PlainDate (removes time information)
   */
  toPlainDate(): { year: number; month: number; day: number; dayOfWeek: number } {
    const plainDT = TemporalAdapter.toPlainDateTime(this.temporal);
    return {
      year: plainDT.year,
      month: plainDT.month,
      day: plainDT.day,
      dayOfWeek: (plainDT as any).dayOfWeek,
    };
  }

  /**
   * Convert to PlainTime (removes date information)
   */
  toPlainTime(): { hour: number; minute: number; second: number; millisecond: number } {
    const plainDT = TemporalAdapter.toPlainDateTime(this.temporal);
    return {
      hour: plainDT.hour,
      minute: plainDT.minute,
      second: plainDT.second,
      millisecond: plainDT.millisecond,
    };
  }

  /**
   * Create new TimeGuard with only date, keeping time from parameter
   */
  withDate(year: number, month: number, day: number): TimeGuard {
    return this.set({ year, month, day });
  }

  /**
   * Create new TimeGuard with only time, keeping date
   */
  withTime(hour: number, minute: number = 0, second: number = 0, millisecond: number = 0): TimeGuard {
    return this.set({ hour, minute, second, millisecond });
  }

  // ===== Timezone methods =====

  /**
   * Get timezone offset in format ±HH:mm
   */
  getOffset(): string {
    if ((this.temporal as any)?.offset) {
      return (this.temporal as any).offset || 'Z';
    }
    return 'Z'; // PlainDateTime is in UTC
  }

  /**
   * Get timezone offset in nanoseconds
   */
  getOffsetNanoseconds(): number {
    if ((this.temporal as any)?.offsetNanoseconds) {
      return (this.temporal as any).offsetNanoseconds || 0;
    }
    return 0;
  }

  /**
   * Get timezone ID
   */
  getTimeZoneId(): string | null {
    if ((this.temporal as any)?.timeZoneId) {
      return (this.temporal as any).timeZoneId || null;
    }
    return null;
  }

  /**
   * Start of the day in current timezone
   */
  startOfDay(): TimeGuard {
    return this.startOf('day');
  }

  /**
   * End of the day in current timezone
   */
  endOfDay(): TimeGuard {
    return this.endOf('day');
  }

  // ===== Additional Duration methods =====

  /**
   * Calculate duration from another TimeGuard (inverse of until)
   * Returns negative values if other is before this
   * @returns Duration object with .humanize() and other methods
   * @example
   * end.since(start).humanize() // "2 months and 5 days"
   * end.since(start).humanize({ locale: 'es' }) // "2 meses y 5 días"
   */
  since(other: TimeGuard, options?: IDurationOptions): DurationResult {
    const plainDT1 = TemporalAdapter.toPlainDateTime(this.temporal);
    const plainDT2 = TemporalAdapter.toPlainDateTime(other.temporal);

    const startTime = performance.now();

    try {
      // Pass largestUnit and smallestUnit to Temporal.since() for proper normalization
      const temporalOptions: any = {};
      if (options?.largestUnit) {
        temporalOptions.largestUnit = options.largestUnit;
      }
      if (options?.smallestUnit) {
        temporalOptions.smallestUnit = options.smallestUnit;
      }
      const duration = (plainDT1 as any).since(plainDT2, Object.keys(temporalOptions).length > 0 ? temporalOptions : undefined);
      const parts = TimeGuard.toDurationParts(duration);

      // Collect leap year information for explanation
      const startYear = plainDT2.year;
      const endYear = plainDT1.year;
      const leapYearFlags: Array<{ year: number; isLeap: boolean; daysInFebruary: number }> = [];

      for (let year = startYear; year <= endYear; year++) {
        const isLeap = TimeGuard.isLeapYearValue(year);
        leapYearFlags.push({
          year,
          isLeap,
          daysInFebruary: isLeap ? 29 : 28,
        });
      }

      // Generate explanation steps
      const steps = this.generateUntilSteps(plainDT2, plainDT1, parts, leapYearFlags);

      const endTime = performance.now();
      const calculationTimeMs = endTime - startTime;

      // Return DurationResult with full metadata
      return new DurationResult(parts, this.config.locale, {
        startDate: plainDT2.toString(),
        endDate: plainDT1.toString(),
        steps,
        mode: 'exact',
        leapYearFlags: leapYearFlags.filter(f => f.isLeap),
        calculationTimeMs,
      });
    } catch {
      return new DurationResult(TimeGuard.ZERO_DURATION, this.config.locale, {
        startDate: plainDT2.toString(),
        endDate: plainDT1.toString(),
        steps: ['Calculation failed, returning zero duration'],
        mode: 'estimated',
      });
    }
  }

  /**
   * Get ISO 8601 duration string
   * Example: P1Y2M3DT4H5M6S
   */
  toDurationString(other?: TimeGuard): string {
    const duration = other ? this.until(other) : this.until(TimeGuard.now());

    const parts: string[] = [];

    if (duration.years) parts.push(`${duration.years}Y`);
    if (duration.months) parts.push(`${duration.months}M`);
    if (duration.days) parts.push(`${duration.days}D`);

    const timeParts: string[] = [];
    if (duration.hours) timeParts.push(`${duration.hours}H`);
    if (duration.minutes) timeParts.push(`${duration.minutes}M`);
    if (duration.seconds) timeParts.push(`${duration.seconds}S`);

    const result = `P${parts.join('')}${timeParts.length > 0 ? 'T' + timeParts.join('') : ''}`;
    return result === 'P' ? 'PT0S' : result;
  }

  /**
   * Check if this date is in the past
   */
  isPast(): boolean {
    return this.isBefore(TimeGuard.now());
  }

  /**
   * Check if this date is in the future
   */
  isFuture(): boolean {
    return this.isAfter(TimeGuard.now());
  }

  /**
   * Check if this date is today
   */
  isToday(): boolean {
    return this.isSame(TimeGuard.now(), 'day');
  }

  /**
   * Check if this date is tomorrow
   */
  isTomorrow(): boolean {
    return this.isSame(TimeGuard.now().add({ day: 1 }), 'day');
  }

  /**
   * Check if this date is yesterday
   */
  isYesterday(): boolean {
    return this.isSame(TimeGuard.now().subtract({ day: 1 }), 'day');
  }
}

export { PluginManager } from './plugins/manager';
