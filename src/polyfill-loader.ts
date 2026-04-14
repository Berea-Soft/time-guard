/**
 * Polyfill Loader - Automatically loads Temporal API polyfill if needed
 * No user installation required - polyfill is included in time-guard
 * Compatible with both ESM and CJS environments (SSR / Nest / Nuxt / Node.js)
 */

// Auto-load polyfill if Temporal is not available
if (typeof globalThis !== 'undefined' && !((globalThis as any).Temporal)) {
  // In Node.js/CommonJS environments, load the polyfill and assign to globalThis
  if (typeof process !== 'undefined' && typeof globalThis.require === 'function') {
    try {
      // Load polyfill and assign Temporal to globalThis
      const TemporalPolyfill = globalThis.require('@js-temporal/polyfill');
      if (TemporalPolyfill && TemporalPolyfill.Temporal) {
        (globalThis as any).Temporal = TemporalPolyfill.Temporal;
      }
    } catch (_error) {
      console.warn(
        '[time-guard] Failed to load @js-temporal/polyfill. Please ensure it is installed.'
      );
    }
  } else {
    // In browser/ESM environments, use dynamic import
    import(/* @vite-ignore */ '@js-temporal/polyfill').then((TemporalModule) => {
      if (TemporalModule && TemporalModule.Temporal) {
        (globalThis as any).Temporal = TemporalModule.Temporal;
      }
    }).catch(() => {
      console.warn(
        '[time-guard] Temporal API not available. Please ensure @js-temporal/polyfill is installed, or use a browser with native Temporal support.'
      );
    });
  }
}

export {};
