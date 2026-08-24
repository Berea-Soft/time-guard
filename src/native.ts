/**
 * TimeGuard - Modern date/time library using Temporal API
 * Native Mode (zero-polyfill build, ~5KB gzip)
 *
 * Assumes globalThis.Temporal is already available in the environment —
 * this entry never imports @js-temporal/polyfill, so bundlers can tree-shake
 * it away entirely. Requires one of:
 *   - Node.js >=26.0.0 (Temporal enabled by default, unflagged, since v26.0.0)
 *   - A browser with native Temporal (Chrome/Edge >=144, Firefox >=139)
 *   - Any runtime where you've assigned your own Temporal polyfill to
 *     globalThis.Temporal *before* importing this module
 *
 * On an unsupported runtime, calling any TimeGuard method throws immediately
 * with an actionable error instead of silently misbehaving — see
 * `TemporalAdapter`'s `useTemporal()` in ./adapters/temporal.adapter.ts.
 *
 * If you're not sure your target runtime has native Temporal, import
 * `@bereasoftware/time-guard` (the default entry) instead — it auto-loads
 * the polyfill and exposes the exact same API surface as this entry.
 *
 * @author Berea-Soft
 * @license MIT
 */

export * from './core';
