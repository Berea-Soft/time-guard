/**
 * Vitest setup file - Loads Temporal polyfill globally
 * This ensures Temporal API is available in all tests
 */

// First, try to import the mock to ensure it's always available
import('./temporal-mock');

// Then try to import real polyfill (may override mock)
try {
  await import('@js-temporal/polyfill');
} catch {
  // Mock is already loaded, continue
  console.warn('Real @js-temporal/polyfill not loaded, using mock Temporal');
}


