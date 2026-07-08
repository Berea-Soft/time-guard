<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <div
        class="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg"
      >
        🧩
      </div>
      <div>
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">
          Sistema de Plugins
        </h3>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          PluginManager · RelativeTime · Duration.explain() · AdvancedFormat
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- RelativeTimePlugin -->
      <div
        class="p-4 rounded-xl bg-white dark:bg-slate-800/50 border dark:border-slate-700"
      >
        <p
          class="text-xs font-semibold uppercase tracking-wider text-fuchsia-500 mb-2"
        >
          ⏳ RelativeTimePlugin
        </p>
        <div class="space-y-1.5 text-sm">
          <p>
            <span class="text-slate-400">tg.fromNow():</span>
            <span class="font-mono font-medium">{{ fromNowResult }}</span>
          </p>
          <p>
            <span class="text-slate-400">tg.toNow():</span>
            <span class="font-mono font-medium">{{ toNowResult }}</span>
          </p>
        </div>
      </div>

      <!-- AdvancedFormatPlugin -->
      <div
        class="p-4 rounded-xl bg-white dark:bg-slate-800/50 border dark:border-slate-700"
      >
        <p
          class="text-xs font-semibold uppercase tracking-wider text-fuchsia-500 mb-2"
        >
          🎨 AdvancedFormatPlugin
        </p>
        <div class="space-y-1.5 text-sm">
          <p>
            <span class="text-slate-400">Q (trimestre):</span>
            <span class="font-mono font-medium">{{ advanced.quarter }}</span>
          </p>
          <p>
            <span class="text-slate-400">Do (ordinal):</span>
            <span class="font-mono font-medium">{{ advanced.ordinal }}</span>
          </p>
          <p>
            <span class="text-slate-400">w (semana del año):</span>
            <span class="font-mono font-medium">{{ advanced.week }}</span>
          </p>
          <p>
            <span class="text-slate-400">X / x (unix s / ms):</span>
            <span class="font-mono font-medium">{{ advanced.unix }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Duration.explain() -->
    <div
      class="p-4 rounded-xl bg-white dark:bg-slate-800/50 border dark:border-slate-700"
    >
      <p
        class="text-xs font-semibold uppercase tracking-wider text-purple-500 mb-2"
      >
        🔬 DurationResult.explain() — matemática transparente
      </p>
      <p class="text-xs text-slate-400 mb-2">
        {{ explanation.input.join(' → ') }} · modo {{ explanation.mode }}
      </p>
      <ul class="space-y-1 text-xs font-mono">
        <li
          v-for="(step, i) in explanation.steps"
          :key="i"
          class="text-slate-600 dark:text-slate-300"
        >
          {{ i + 1 }}. {{ step }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  TimeGuard,
  PluginManager,
  relativeTimePlugin,
  advancedFormatPlugin,
} from '@bereasoftware/time-guard';

// Plugins extend TimeGuard.prototype once registered — PluginManager skips
// re-registration if already installed (e.g. when navigating back to this demo).
PluginManager.use(relativeTimePlugin, TimeGuard);
PluginManager.use(advancedFormatPlugin, TimeGuard);

const past = TimeGuard.now().subtract({ hour: 5 }).locale('es') as TimeGuard & {
  fromNow(withoutSuffix?: boolean): string;
};
const future = TimeGuard.now().add({ day: 2 }).locale('es') as TimeGuard & {
  toNow(withoutSuffix?: boolean): string;
};
const fromNowResult = past.fromNow();
const toNowResult = future.toNow();

const sample = TimeGuard.from('2026-07-15T14:30:00').locale('es');
const advanced = {
  quarter: sample.format('[T]Q [de] YYYY'),
  ordinal: sample.format('Do [de] MMMM'),
  week: sample.format('[semana] w [del] YYYY'),
  unix: `${sample.format('X')}s / ${sample.format('x')}ms`,
};

// explain() works on any DurationResult from until()/since()/between() —
// no plugin needed, it's core.
const start = TimeGuard.from('2024-02-01');
const end = TimeGuard.from('2026-03-05');
const explanation = start.until(end).explain();
</script>
