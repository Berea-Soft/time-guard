<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <div
        class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg"
      >
        📆
      </div>
      <div>
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">
          Business Days
        </h3>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          Días hábiles · Feriados · Aritmética corporativa
        </p>
      </div>
    </div>

    <!-- Holiday registration -->
    <div
      class="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
    >
      <p
        class="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2"
      >
        📌 Feriados Registrados
      </p>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="h in holidays"
          :key="h"
          class="px-2 py-1 text-xs rounded-full bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-200 font-mono"
        >
          {{ h }}
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- isBusinessDay checks -->
      <div
        class="p-4 rounded-xl bg-white dark:bg-slate-800/50 border dark:border-slate-700"
      >
        <p
          class="text-xs font-semibold uppercase tracking-wider text-emerald-500 mb-3"
        >
          🔍 Consultas
        </p>
        <div class="space-y-2 text-sm">
          <div
            v-for="d in dayChecks"
            :key="d.label"
            class="flex items-center justify-between px-3 py-2 rounded-lg"
            :class="
              d.isBusiness
                ? 'bg-green-50 dark:bg-green-900/20'
                : 'bg-red-50 dark:bg-red-900/20'
            "
          >
            <span class="font-mono text-xs">{{ d.label }}</span>
            <span
              class="text-xs font-semibold"
              :class="
                d.isBusiness
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              "
            >
              {{ d.isBusiness ? '✅ Hábil' : '❌ No hábil' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Business day arithmetic -->
      <div
        class="p-4 rounded-xl bg-white dark:bg-slate-800/50 border dark:border-slate-700"
      >
        <p
          class="text-xs font-semibold uppercase tracking-wider text-emerald-500 mb-3"
        >
          ➕ Aritmética Hábil
        </p>
        <div class="space-y-2 text-sm">
          <div
            v-for="a in arithmetic"
            :key="a.label"
            class="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800"
          >
            <p>
              <span class="text-slate-400">{{ a.label }}:</span>
            </p>
            <p class="font-mono text-xs mt-0.5">{{ a.result }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount } from 'vue';
import { TimeGuard } from '@bereasoftware/time-guard';

// Register holidays
const holidaysList = ['2026-05-25', '2026-12-25', '2026-01-01', '2026-12-31'];
TimeGuard.registerHolidays(holidaysList);

// Clean up on unmount
onBeforeUnmount(() => {
  TimeGuard.clearHolidays();
});

const holidays = TimeGuard.getRegisteredHolidays();

// Day checks — wrap in function to compute lazily
const dayChecks = [
  { label: '2026-05-22 (Vie)', date: '2026-05-22' },
  { label: '2026-05-25 (Lun feriado)', date: '2026-05-25' },
  { label: '2026-05-26 (Mar)', date: '2026-05-26' },
  { label: '2026-05-23 (Sáb)', date: '2026-05-23' },
].map((d) => ({
  ...d,
  isBusiness: TimeGuard.from(d.date).isBusinessDay(),
}));

// Arithmetic
const start = TimeGuard.from('2026-05-22').locale('es');
const arithmetic = [
  { label: 'Desde: 2026-05-22 (Vie)', result: '' },
  {
    label: '+ 3 días hábiles',
    result: start.addBusinessDays(3).format('dddd DD MMM YYYY'),
  },
  {
    label: '+ 10 días hábiles',
    result: start.addBusinessDays(10).format('dddd DD MMM YYYY'),
  },
  {
    label: '- 2 días hábiles',
    result: start.subtractBusinessDays(2).format('dddd DD MMM YYYY'),
  },
];
</script>
