/**
 * TimeGuard - Modern date/time library using Temporal API
 * Full bundle (backward compatible)
 * Includes: core + all locales + all plugins + all calendars + polyfill (auto-loaded)
 *
 * @author Berea-Soft
 * @license MIT
 */

// Initialize Temporal polyfill
import '@js-temporal/polyfill';
import './polyfill-loader';

import { TimeGuard } from './time-guard';
import type { ITimeGuardConfig } from './types';
import { LocaleManager, EN_LOCALE, ES_LOCALE } from './locales/locale.manager';
import { ALL_LOCALES } from './locales/index';

// Core exports
export { TimeGuard };

// Type exports (zero cost — erased at build time)
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

// Locale exports (core only: manager + EN/ES built-in)
export { LocaleManager, EN_LOCALE, ES_LOCALE };

// Locale exports (all locales)
export { getAvailableLocales, LOCALES_COUNT, ALL_LOCALES, registerAllLocales } from './locales/index';

// Formatter exports
export { DateFormatter } from './formatters/date.formatter';

// Calendar exports (core only: Gregorian + manager)
export {
  CalendarManager,
  GregorianCalendar,
  calendarManager,
} from './calendars/calendar.manager';

// Calendar exports (all calendar systems)
export {
  IslamicCalendar,
  HebrewCalendar,
  ChineseCalendar,
  JapaneseCalendar,
  BuddhistCalendar,
} from './calendars/index';

// Plugin Manager (core infra, no built-in plugins)
export { PluginManager } from './plugins/manager';

// Plugin exports (all plugins)
export { RelativeTimePlugin, default as relativeTimePlugin } from './plugins/relative-time';
export type { RelativeTimeConfig, RelativeTimeFormats, RelativeTimeThreshold } from './plugins/relative-time/types';

export { DurationPlugin, Duration, default as durationPlugin } from './plugins/duration';
export type { IDuration, DurationInput, DurationObject, DurationUnit } from './plugins/duration/types';

export { AdvancedFormatPlugin, default as advancedFormatPlugin } from './plugins/advanced-format';

// Factory function (fluent API)
export function timeGuard(input?: unknown, config?: ITimeGuardConfig) {
  return new TimeGuard(input, config);
}

// Convenience exports
declare const __VERSION__: string;
export const version: string = __VERSION__;

// Auto-register all locales into LocaleManager
LocaleManager.getInstance().loadLocales(ALL_LOCALES);