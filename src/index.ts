/**
 * TimeGuard - Modern date/time library using Temporal API
 * Lightweight core: ~5KB (without polyfill)
 *
 * Locales, plugins, and calendars are loaded on demand:
 *   import { ALL_LOCALES, registerAllLocales } from '@bereasoftware/time-guard/locales'
 *   import { RelativeTimePlugin } from '@bereasoftware/time-guard/plugins/relative-time'
 *   import { IslamicCalendar } from '@bereasoftware/time-guard/calendars'
 *
 * @author Berea-Soft
 * @license MIT
 */

// Core exports
export { TimeGuard } from './time-guard';

// Import TimeGuard for use in factory function
import { TimeGuard } from './time-guard';
import type { ITimeGuardConfig } from './types';

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
export { LocaleManager, EN_LOCALE, ES_LOCALE } from './locales/locale.manager';

// Formatter exports
export { DateFormatter } from './formatters/date.formatter';

// Calendar exports (core only: Gregorian + manager)
export {
  CalendarManager,
  GregorianCalendar,
  calendarManager,
} from './calendars/calendar.manager';

// Plugin Manager (core infra, no built-in plugins)
export { PluginManager } from './plugins/manager';

// Factory function (fluent API)
export function timeGuard(input?: unknown, config?: ITimeGuardConfig) {
  return new TimeGuard(input, config);
}

// Convenience exports
declare const __VERSION__: string;
export const version: string = __VERSION__;