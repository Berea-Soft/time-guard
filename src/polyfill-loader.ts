/**
 * Polyfill Loader - Verifies Temporal API availability
 * The actual polyfill is loaded via `import '@js-temporal/polyfill'` in index.ts
 */

if (typeof globalThis !== 'undefined' && !((globalThis as any).Temporal)) {
  console.warn(
    '[time-guard] Temporal API not available. Install @js-temporal/polyfill or use a browser with native Temporal support.'
  );
}

export {};
