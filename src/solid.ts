/**
 * TimeGuard — SolidJS Integration
 *
 * Provides reactive signal-based wrappers for TimeGuard using Solid's
 * fine-grained reactivity system. All hooks return signals (`Accessor`)
 * that automatically update without re-rendering the entire component tree.
 *
 * @example
 * ```tsx
 * import { useCurrentTime, useRelativeTime } from '@bereasoftware/time-guard/solid';
 *
 * function Clock() {
 *   const now = useCurrentTime({ interval: 1000 });
 *   const relative = useRelativeTime('2026-05-20T08:00:00');
 *
 *   return (
 *     <div>
 *       <h1>{now().format('HH:mm:ss')}</h1>
 *       <p>Published: {relative()}</p>
 *     </div>
 *   );
 * }
 * ```
 */

import { createSignal, createEffect, onCleanup, type Accessor } from 'solid-js';
import {
  TimeGuard,
  type ITimeGuardConfig,
  type TimeRange,
  DEFAULT_TICK_INTERVAL_MS,
  DEFAULT_RELATIVE_INTERVAL_MS,
  computeRelativeTime,
  createTimeRangeFrom,
} from './core';

/**
 * Context key for providing global TimeGuard configuration.
 * Use Solid's `createContext` + `useContext` at the app level.
 */
export const TimeGuardConfigContext = Symbol('TimeGuardConfig');

/**
 * Creates a reactive signal of a TimeGuard instance.
 * The signal updates reactively when `input` changes.
 *
 * ```tsx
 * const tg = useTimeGuard('2026-05-20');
 * return <p>{tg().format('dddd, DD MMMM YYYY')}</p>;
 * ```
 */
export function useTimeGuard(
  input?: unknown,
  config?: ITimeGuardConfig,
): Accessor<TimeGuard> {
  const [tg, setTg] = createSignal(TimeGuard.from(input, config));

  createEffect(() => {
    // Re-create when input or config serialized signature changes
    const _input = input;
    setTg(() => TimeGuard.from(_input, config));
  });

  return tg;
}

/**
 * Creates a signal of the current time that ticks on a specified interval
 * (default 1000ms). Clears the interval on cleanup.
 *
 * ```tsx
 * const now = useCurrentTime({ interval: 1000 });
 * return <p>{now().format('HH:mm:ss')}</p>;
 * ```
 */
export function useCurrentTime(options?: {
  interval?: number;
  config?: ITimeGuardConfig;
}): Accessor<TimeGuard> {
  const interval = options?.interval ?? DEFAULT_TICK_INTERVAL_MS;
  const config = options?.config;

  const [time, setTime] = createSignal(TimeGuard.now(config));

  const timer = setInterval(() => {
    setTime(TimeGuard.now(config));
  }, interval);

  onCleanup(() => {
    clearInterval(timer);
  });

  return time;
}

/**
 * Creates a signal of a relative time string that recalculates periodically
 * (default every 60s).
 *
 * ```tsx
 * const relative = useRelativeTime('2026-05-20T08:00:00', { locale: 'es' });
 * return <p>{relative()}</p>;
 * ```
 */
export function useRelativeTime(
  date: unknown,
  options?: {
    interval?: number;
    locale?: string;
    numeric?: 'always' | 'auto';
  },
): Accessor<string> {
  const interval = options?.interval ?? DEFAULT_RELATIVE_INTERVAL_MS;
  const locale = options?.locale;
  const numeric = options?.numeric;

  const compute = () => computeRelativeTime(date, { locale, numeric });

  const [relative, setRelative] = createSignal(compute());

  const timer = setInterval(() => {
    setRelative(compute());
  }, interval);

  onCleanup(() => {
    clearInterval(timer);
  });

  return relative;
}

/**
 * Creates a signal of a TimeRange instance.
 *
 * ```tsx
 * const range = useTimeRange('2026-05-20', '2026-06-01');
 * return <p>Duration: {range().humanize()}</p>;
 * ```
 */
export function useTimeRange(
  start: unknown,
  end: unknown,
  config?: ITimeGuardConfig,
): Accessor<TimeRange> {
  const [range, setRange] = createSignal(
    createTimeRangeFrom(start, end, config),
  );

  createEffect(() => {
    const _start = start;
    const _end = end;
    setRange(() => createTimeRangeFrom(_start, _end, config));
  });

  return range;
}
