/**
 * Polyfill Loader - Automatically loads Temporal API polyfill if needed
 * No user installation required - polyfill is included in time-guard
 * Compatible with both ESM and CJS environments (SSR / Nest / Nuxt / Node.js)
 */

import { Temporal } from '@js-temporal/polyfill';

// Assign Temporal to globalThis so other modules can find it
if (typeof globalThis !== 'undefined' && !((globalThis as any).Temporal)) {
  (globalThis as any).Temporal = Temporal;
}

export {};
