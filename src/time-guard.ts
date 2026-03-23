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
} from './types';
import { TemporalAdapter } from './adapters/temporal.adapter';
import { DateFormatter } from './formatters/date.formatter';
import type { Temporal } from '@js-temporal/polyfill';

type TemporalDateTime = Temporal.PlainDateTime | Temporal.ZonedDateTime;

/**
 * TimeGuard implementation - Main facade class
 */
export class TimeGuard implements ITimeGuard {
  private temporal: TemporalDateTime;
  private config: Required<ITimeGuardConfig>;
  private formatterInstance: DateFormatter;

  constructor(input?: unknown, config?: ITimeGuardConfig) {
    this.formatterInstance = new DateFormatter();

    // Set default config
    this.config = {
      locale: config?.locale || 'en',
      timezone: config?.timezone || 'UTC',
      strict: config?.strict ?? false,
    };

    // Parse input to Temporal
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

  /**
   * Static factory methods
   */
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

  // ===== Conversion methods =====

  toTemporal(): any { // Temporal.PlainDateTime | Temporal.ZonedDateTime
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

  // ===== Locale methods =====

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

  // ===== Timezone methods =====

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

  // ===== Format methods =====

  format(pattern: string | FormatPreset): string {
    const plainDT = TemporalAdapter.toPlainDateTime(this.temporal);
    // Check if it's a known preset
    const knownPresets = ['iso', 'date', 'time', 'datetime', 'rfc2822', 'rfc3339', 'utc'];
    const formatPattern = knownPresets.includes(pattern as string)
      ? this.formatterInstance.getPreset(pattern as FormatPreset)
      : (pattern as string);
    return this.formatterInstance.format(plainDT, formatPattern, this.config.locale);
  }

  // ===== Get methods =====

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

  // ===== Arithmetic methods =====

  add(units: Partial<Record<Unit, number>>): TimeGuard {
    let plainDT = TemporalAdapter.toPlainDateTime(this.temporal);

    // Map unit names to Temporal duration
    const duration: any = {};
    Object.entries(units).forEach(([unit, value]) => {
      if (value !== undefined && value !== 0) {
        duration[unit + 's'] = value; // Convert 'day' to 'days', etc.
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

  diff(other: TimeGuard, unit: Unit = 'millisecond'): number {
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

    // Calculate this - other (not other - this)
    const duration = (plainDT1 as any).since(plainDT2);
    const mappedUnit = unitMap[unit];
    return Math.round((duration as any)[mappedUnit] || 0);
  }

  // ===== Query methods =====

  isBefore(other: TimeGuard): boolean {
    const plainDT1 = TemporalAdapter.toPlainDateTime(this.temporal);
    const plainDT2 = TemporalAdapter.toPlainDateTime(other.temporal);
    return (plainDT1 as any).compare(plainDT2) < 0;
  }

  isAfter(other: TimeGuard): boolean {
    const plainDT1 = TemporalAdapter.toPlainDateTime(this.temporal);
    const plainDT2 = TemporalAdapter.toPlainDateTime(other.temporal);
    return (plainDT1 as any).compare(plainDT2) > 0;
  }

  isSame(other: TimeGuard, unit?: Unit): boolean {
    if (!unit) {
      return (TemporalAdapter.toPlainDateTime(this.temporal) as any).compare(
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

      afterStart = (plainCopy as any).compare(plainStart) >= 0;
      beforeEnd = (plainEndCopy as any).compare(plainEnd) <= 0;
    } else {
      afterStart = (plainDT as any).compare(plainStart) >= 0;
      beforeEnd = (plainDT as any).compare(plainEnd) <= 0;
    }

    const hasStartBracket = inclusivity[0] === '[';
    const hasEndBracket = inclusivity[1] === ']';

    return (hasStartBracket ? afterStart : (plainDT as any).compare(plainStart) > 0)
      && (hasEndBracket ? beforeEnd : (plainDT as any).compare(plainEnd) < 0);
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
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    return isLeapYear ? 366 : 365;
  }

  inLeapYear(): boolean {
    const plainDT = TemporalAdapter.toPlainDateTime(this.temporal);
    const year = plainDT.year;
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  // ===== Duration and Rounding methods =====

  /**
   * Calculate duration until another TimeGuard
   */
  until(other: TimeGuard): { years: number; months: number; days: number; hours: number; minutes: number; seconds: number; milliseconds: number } {
    const plainDT1 = TemporalAdapter.toPlainDateTime(this.temporal);
    const plainDT2 = TemporalAdapter.toPlainDateTime(other.temporal);

    try {
      const duration = (plainDT2 as any).since(plainDT1);
      return {
        years: Math.floor(duration.years || 0),
        months: Math.floor(duration.months || 0),
        days: Math.floor(duration.days || 0),
        hours: Math.floor(duration.hours || 0),
        minutes: Math.floor(duration.minutes || 0),
        seconds: Math.floor(duration.seconds || 0),
        milliseconds: Math.floor(duration.milliseconds || 0),
      };
    } catch {
      return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
    }
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
   */
  since(other: TimeGuard): { years: number; months: number; days: number; hours: number; minutes: number; seconds: number; milliseconds: number } {
    const plainDT1 = TemporalAdapter.toPlainDateTime(this.temporal);
    const plainDT2 = TemporalAdapter.toPlainDateTime(other.temporal);

    try {
      // since() returns duration FROM point to THIS point
      const duration = (plainDT1 as any).since(plainDT2);
      return {
        years: Math.floor(duration.years || 0),
        months: Math.floor(duration.months || 0),
        days: Math.floor(duration.days || 0),
        hours: Math.floor(duration.hours || 0),
        minutes: Math.floor(duration.minutes || 0),
        seconds: Math.floor(duration.seconds || 0),
        milliseconds: Math.floor(duration.milliseconds || 0),
      };
    } catch {
      return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
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
