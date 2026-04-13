/**
 * Polyfill Loader - Automatically loads Temporal API polyfill if needed
 * No user installation required - polyfill is included in time-guard
 * Compatible with both ESM and CJS environments (SSR / Nest / Nuxt / Node.js)
 */

// Auto-load polyfill if Temporal is not available
if (typeof globalThis !== 'undefined' && !((globalThis as any).Temporal)) {
  // In Node.js/CommonJS environments, try synchronous require first
  if (typeof process !== 'undefined' && typeof globalThis.require === 'function') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      globalThis.require('@js-temporal/polyfill');
    } catch (_error) {
      console.warn(
        '[time-guard] Failed to load @js-temporal/polyfill. Please ensure it is installed.'
      );
    }
  } else {
    // In browser/ESM environments, use dynamic import
    try {
      import(/* @vite-ignore */ '@js-temporal/polyfill').catch(() => {
        console.warn(
          '[time-guard] Temporal API not available. Please ensure @js-temporal/polyfill is installed, or use a browser with native Temporal support.'
        );
      });
    } catch (_error) {
      // Import failed
    }
  }
}

export {};
