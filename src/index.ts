/**
 * TimeGuard - Modern date/time library using Temporal API
 * Full bundle (Temporal polyfill auto-loaded)
 * Includes: core + polyfill (auto-loaded). Only `en`/`es` locales are
 * registered by default — call `loadAllLocales()` (or import the standalone
 * `./locales` entry) to register the rest on demand.
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

// Export everything from core
export * from './core';
