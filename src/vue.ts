import {
  ref,
  watch,
  onUnmounted,
  inject,
  type Ref,
  type Plugin,
  type Directive,
  type DirectiveBinding,
} from 'vue';
import { TimeGuard, type ITimeGuardConfig } from './core';

/**
 * Unique symbol key for injecting TimeGuard global configuration.
 */
export const TimeGuardConfigKey = Symbol('TimeGuardConfig');

/**
 * Vue Directive for dynamically and reactively formatting dates.
 * Usage:
 * - `<span v-time-guard:format="date" data-pattern="YYYY-MM-DD"></span>`
 * - `<span v-time-guard:relative="date" data-locale="es"></span>`
 */
/** Internal WeakMap to track interval timers per element (avoids `any` casts). */
const directiveTimerMap = new WeakMap<
  HTMLElement,
  ReturnType<typeof setInterval>
>();

export const vTimeGuard: Directive<HTMLElement, unknown> = {
  mounted(el, binding) {
    updateDirective(el, binding);
  },
  updated(el, binding) {
    updateDirective(el, binding);
  },
  unmounted(el) {
    const timer = directiveTimerMap.get(el);
    if (timer) {
      clearInterval(timer);
      directiveTimerMap.delete(el);
    }
  },
};

function updateDirective(el: HTMLElement, binding: DirectiveBinding<unknown>) {
  // Clear any existing active timer
  const existingTimer = directiveTimerMap.get(el);
  if (existingTimer) {
    clearInterval(existingTimer);
    directiveTimerMap.delete(el);
  }

  const value = binding.value;
  if (value === undefined || value === null) {
    el.textContent = '';
    return;
  }

  const mode = binding.arg || 'format'; // 'format' or 'relative'
  const pattern = el.getAttribute('data-pattern') || 'YYYY-MM-DD HH:mm:ss';
  const locale = el.getAttribute('data-locale') || undefined;
  const intervalMs = parseInt(el.getAttribute('data-interval') || '60000', 10);
  const numeric =
    (el.getAttribute('data-numeric') as 'always' | 'auto') || undefined;

  const render = () => {
    try {
      const tg = TimeGuard.from(value);
      if (mode === 'relative') {
        const now = TimeGuard.now();
        el.textContent = tg.since(now).humanize({ locale, numeric });
      } else {
        el.textContent = locale
          ? tg.locale(locale).format(pattern)
          : tg.format(pattern);
      }
    } catch {
      el.textContent = String(value);
    }
  };

  render();

  // Set up polling interval if dynamic relative or live updates are configured
  if (mode === 'relative' || el.getAttribute('data-live') === 'true') {
    directiveTimerMap.set(el, setInterval(render, intervalMs));
  }
}

/**
 * Vue Plugin to register a global TimeGuard configuration and register v-time-guard directive.
 */
export const TimeGuardVuePlugin: Plugin = {
  install(app, options?: ITimeGuardConfig) {
    app.provide(TimeGuardConfigKey, options);
    app.directive('time-guard', vTimeGuard);
  },
};

/**
 * Vue Composable to create a reactive Ref of a TimeGuard instance.
 * Automatically updates when input or configuration changes.
 * Inherits global injected configuration as fallback.
 */
export function useTimeGuard(
  input?: unknown,
  config?: ITimeGuardConfig,
): Ref<TimeGuard> {
  const globalConfig = inject<ITimeGuardConfig | undefined>(
    TimeGuardConfigKey,
    undefined,
  );
  const activeConfig = config ?? globalConfig;
  const tg = ref(TimeGuard.from(input, activeConfig)) as Ref<TimeGuard>;

  watch(
    [
      () => input,
      () => (activeConfig ? JSON.stringify(activeConfig) : undefined),
    ],
    () => {
      tg.value = TimeGuard.from(input, activeConfig);
    },
    { deep: true },
  );

  return tg;
}

/**
 * Vue Composable to get a reactive TimeGuard Ref representing the current time.
 * Automatically updates on a specified interval (default: 1000ms).
 * Inherits global injected configuration as fallback.
 */
export function useCurrentTime(options?: {
  interval?: number;
  config?: ITimeGuardConfig;
}): Ref<TimeGuard> {
  const globalConfig = inject<ITimeGuardConfig | undefined>(
    TimeGuardConfigKey,
    undefined,
  );
  const activeConfig = options?.config ?? globalConfig;
  const interval = options?.interval ?? 1000;
  const time = ref(TimeGuard.now(activeConfig)) as Ref<TimeGuard>;

  const timer = setInterval(() => {
    time.value = TimeGuard.now(activeConfig);
  }, interval);

  onUnmounted(() => {
    clearInterval(timer);
  });

  return time;
}

/**
 * Vue Composable that returns a reactive relative time Ref updating periodically.
 * Inherits global injected configuration as fallback.
 */
export function useRelativeTime(
  date: unknown,
  options?: {
    interval?: number;
    locale?: string;
    numeric?: 'always' | 'auto';
  },
): Ref<string> {
  const globalConfig = inject<ITimeGuardConfig | undefined>(
    TimeGuardConfigKey,
    undefined,
  );
  const interval = options?.interval ?? 60000;
  const locale = options?.locale ?? globalConfig?.locale;
  const numeric = options?.numeric;
  const relative = ref('');

  const update = () => {
    const tgDate = TimeGuard.from(date);
    const now = TimeGuard.now();
    relative.value = tgDate.since(now).humanize({
      locale,
      numeric,
    });
  };

  update();
  const timer = setInterval(update, interval);

  watch(
    [() => date, () => locale, () => numeric],
    () => {
      update();
    },
    { deep: true },
  );

  onUnmounted(() => {
    clearInterval(timer);
  });

  return relative;
}
