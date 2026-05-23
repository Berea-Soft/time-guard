/**
 * TimeGuard - Modern date/time library using Temporal API
 * Full bundle (backward compatible)
 * Includes: core + all locales + all plugins + all calendars + polyfill (auto-loaded)
 *
 * @author Berea-Soft
 * @license MIT
 */

// Initialize Temporal polyfill and assign to globalThis
// The polyfill uses side-effect imports to register Temporal on globalThis
import { Temporal } from '@js-temporal/polyfill';

// Assign Temporal to globalThis so the adapter can find it
if (
  typeof globalThis !== 'undefined' &&
  !(globalThis as Record<string, unknown>).Temporal
) {
  (globalThis as Record<string, unknown>).Temporal = Temporal;
}

import { LocaleManager } from './locales/locale.manager';
import { ALL_LOCALES } from './locales/index';

// Auto-register all locales into LocaleManager
LocaleManager.getInstance().loadLocales(ALL_LOCALES);

// Export everything from core
export * from './core';
