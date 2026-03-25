/**
 * Polyfill Loader - Automatically loads Temporal API polyfill if needed
 * No user installation required - polyfill is included in time-guard
 */

// Auto-load polyfill if Temporal is not available
if (typeof globalThis !== 'undefined' && !((globalThis as any).Temporal)) {
  try {
    require('@js-temporal/polyfill');
  } catch (_error) {
    // Polyfill not available as fallback
    console.warn(
      '[time-guard] Temporal API not available. Please ensure @js-temporal/polyfill is installed, or use a browser with native Temporal support.'
    );
  }
}

export {};
