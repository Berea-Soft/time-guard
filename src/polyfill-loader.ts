/**
 * Polyfill Loader - Automatically loads Temporal API polyfill if needed
 * No user installation required - polyfill is included in time-guard
 * Compatible with both ESM and CJS environments (SSR / Nuxt / Node.js)
 */

// Auto-load polyfill if Temporal is not available
if (typeof globalThis !== 'undefined' && !((globalThis as any).Temporal)) {
  try {
    import('@js-temporal/polyfill').catch(() => {
      console.warn(
        '[time-guard] Temporal API not available. Please ensure @js-temporal/polyfill is installed, or use a browser with native Temporal support.'
      );
    });
  } catch (_error) {
    // Static import in index.ts is the primary mechanism; this is a fallback only
  }
}

export {};
