/**
 * TimeGuard — Qwik Integration
 *
 * Provides reactive signal-based wrappers for TimeGuard using Qwik's
 * resumable reactivity model. All hooks use `useSignal` and
 * `useVisibleTask$` with automatic cleanup for optimal performance.
 *
 * @example
 * ```tsx
 * import { component$ } from '@builder.io/qwik';
 * import { useCurrentTime, useRelativeTime } from '@bereasoftware/time-guard/qwik';
 *
 * export default component$(() => {
 *   const now = useCurrentTime({ interval: 1000 });
 *   const relative = useRelativeTime('2026-05-20T08:00:00');
 *
 *   return (
 *     <div>
 *       <h1>{now.value.format('HH:mm:ss')}</h1>
 *       <p>Published: {relative.value}</p>
 *     </div>
 *   );
 * });
 * ```
 */

import {
  type Signal,
  useSignal,
  useVisibleTask$,
  useTask$,
} from '@builder.io/qwik';
import { TimeGuard, type ITimeGuardConfig, TimeRange } from './core';

/**
 * Creates a Qwik Signal of a TimeGuard instance.
 * Uses `useTask$` to reactively update when input changes.
 * Must be called inside `component$`.
 */
export function useTimeGuard(
  input?: unknown,
  config?: ITimeGuardConfig,
): Signal<TimeGuard> {
  const tg = useSignal(TimeGuard.from(input, config));

  useTask$(({ track }) => {
    track(() => input);
    tg.value = TimeGuard.from(input, config);
  });

  return tg;
}

/**
 * Creates a Qwik Signal of the current time that ticks on a specified
 * interval (default 1000ms). Uses `useVisibleTask$` for cleanup.
 * Must be called inside `component$`.
 */
export function useCurrentTime(options?: {
  interval?: number;
  config?: ITimeGuardConfig;
}): Signal<TimeGuard> {
  const interval = options?.interval ?? 1000;
  const config = options?.config;
  const time = useSignal(TimeGuard.now(config));

  useVisibleTask$(({ cleanup }) => {
    const timer = setInterval(() => {
      time.value = TimeGuard.now(config);
    }, interval);

    cleanup(() => clearInterval(timer));
  });

  return time;
}

/**
 * Creates a Qwik Signal of a relative time string that recalculates
 * periodically (default every 60s).
 * Must be called inside `component$`.
 */
export function useRelativeTime(
  date: unknown,
  options?: {
    interval?: number;
    locale?: string;
    numeric?: 'always' | 'auto';
  },
): Signal<string> {
  const interval = options?.interval ?? 60000;
  const locale = options?.locale;
  const numeric = options?.numeric;

  const compute = () => {
    const tgDate = TimeGuard.from(date);
    const now = TimeGuard.now();
    return tgDate.since(now).humanize({ locale, numeric });
  };

  const relative = useSignal(compute());

  useVisibleTask$(({ cleanup }) => {
    const timer = setInterval(() => {
      relative.value = compute();
    }, interval);

    cleanup(() => clearInterval(timer));
  });

  return relative;
}

/**
 * Creates a Qwik Signal of a TimeRange instance.
 * Must be called inside `component$`.
 */
export function useTimeRange(
  start: unknown,
  end: unknown,
  config?: ITimeGuardConfig,
): Signal<TimeRange> {
  const initial = new TimeRange(
    TimeGuard.from(start, config),
    TimeGuard.from(end, config),
  );
  const range = useSignal(initial);

  useTask$(({ track }) => {
    track(() => start);
    track(() => end);
    const startTg = TimeGuard.from(start, config);
    const endTg = TimeGuard.from(end, config);
    range.value = new TimeRange(startTg, endTg);
  });

  return range;
}
