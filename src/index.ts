/**
 * TimeGuard - Modern date/time library using Temporal API
 * @author Berea-Soft
 * @license MIT
 */

// Initialize Temporal polyfill - must be first BEFORE any other imports
import '@js-temporal/polyfill';
import './polyfill-loader';

// Core exports
export { TimeGuard } from './time-guard';

// Import TimeGuard for use in factory function
import { TimeGuard } from './time-guard';
import type { ITimeGuardConfig } from './types';

// Type exports
export type {
  ITimeGuard,
  ITimeGuardConfig,
  ITimeGuardFactory,
  ITimeGuardPlugin,
  IDateParser,
  IDateFormatter,
  ILocaleManager,
  IDateArithmetic,
  IDateQuery,
  IDateManipulation,
  ITimezoneAdapter,
  ICalendarSystem,
  ICalendarManager,
  IRoundOptions,
  Unit,
  FormatPreset,
  ILocale,
} from './types';

// Adapter exports
export { TemporalAdapter } from './adapters/temporal.adapter';

// Locale exports
export { LocaleManager, EN_LOCALE, ES_LOCALE } from './locales/locale.manager';
export { getAvailableLocales, LOCALES_COUNT } from './locales/index';

// Formatter exports
export { DateFormatter } from './formatters/date.formatter';

// Calendar exports
export {
  CalendarManager,
  GregorianCalendar,
  calendarManager,
} from './calendars/calendar.manager';
export {
  IslamicCalendar,
  HebrewCalendar,
  ChineseCalendar,
  JapaneseCalendar,
  BuddhistCalendar,
} from './calendars/index';

// Factory function (fluent API)
export function timeGuard(input?: unknown, config?: ITimeGuardConfig) {
  return new TimeGuard(input, config);
}

// Plugin Manager exports
export { PluginManager } from './plugins/manager';

// Plugin exports
export { RelativeTimePlugin, default as relativeTimePlugin } from './plugins/relative-time';
export type { RelativeTimeConfig, RelativeTimeFormats, RelativeTimeThreshold } from './plugins/relative-time/types';

export { DurationPlugin, Duration, default as durationPlugin } from './plugins/duration';
export type { IDuration, DurationInput, DurationObject, DurationUnit } from './plugins/duration/types';

export { AdvancedFormatPlugin, default as advancedFormatPlugin } from './plugins/advanced-format';

// Convenience exports
declare const __VERSION__: string;
export const version: string = __VERSION__;