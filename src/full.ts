/**
 * TimeGuard - Full bundle (backward compatible)
 * Includes: core + all locales + all plugins + all calendars + polyfill
 *
 * For a lighter bundle, use the main entry:
 *   import { timeGuard } from '@bereasoftware/time-guard'
 *
 * @author Berea-Soft
 * @license MIT
 */

// Initialize Temporal polyfill
import '@js-temporal/polyfill';
import './polyfill-loader';

// Re-export everything from core
export * from './index';

// Locale exports (all locales)
export { getAvailableLocales, LOCALES_COUNT, ALL_LOCALES, registerAllLocales } from './locales/index';

// Calendar exports (all calendar systems)
export {
  IslamicCalendar,
  HebrewCalendar,
  ChineseCalendar,
  JapaneseCalendar,
  BuddhistCalendar,
} from './calendars/index';

// Plugin exports (all plugins)
export { RelativeTimePlugin, default as relativeTimePlugin } from './plugins/relative-time';
export type { RelativeTimeConfig, RelativeTimeFormats, RelativeTimeThreshold } from './plugins/relative-time/types';

export { DurationPlugin, Duration, default as durationPlugin } from './plugins/duration';
export type { IDuration, DurationInput, DurationObject, DurationUnit } from './plugins/duration/types';

export { AdvancedFormatPlugin, default as advancedFormatPlugin } from './plugins/advanced-format';

// Auto-register all locales into LocaleManager
import { LocaleManager } from './locales/locale.manager';
import { ALL_LOCALES } from './locales/index';
LocaleManager.getInstance().loadLocales(ALL_LOCALES);
