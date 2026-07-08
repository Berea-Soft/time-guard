import { vi } from 'vitest';
import { readFileSync } from 'fs';

// Define __VERSION__ globally for tests (avoids vite define + oxc conflict)
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
vi.stubGlobal('__VERSION__', pkg.version);

/**
 * Vitest setup file - Loads Temporal polyfill globally
 * This ensures Temporal API is available in all tests
 */

// Install the real polyfill as globalThis.Temporal (the package only
// exposes named exports, it doesn't set the global itself). Only fall
// back to the hand-rolled mock if the real polyfill fails to load —
// awaiting this before the mock import avoids a race where the mock's
// own `if (!globalThis.Temporal)` guard wins and silently shadows the
// real implementation for the rest of the test run.
try {
  const { Temporal } = await import('@js-temporal/polyfill');
  (globalThis as unknown as { Temporal: unknown }).Temporal = Temporal;
} catch {
  await import('./temporal-mock');
  console.warn('Real @js-temporal/polyfill not loaded, using mock Temporal');
}

// Register all locales for tests (since core no longer auto-loads them)
import { LocaleManager } from '../src/locales/locale.manager';
import { ALL_LOCALES } from '../src/locales/index';
LocaleManager.getInstance().loadLocales(ALL_LOCALES);
