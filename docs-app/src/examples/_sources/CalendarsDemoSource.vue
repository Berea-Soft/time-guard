<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <div
        class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg"
      >
        🗓️
      </div>
      <div>
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">
          Calendarios Alternativos
        </h3>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          ICalendarSystem · Gregoriano · Islámico · Hebreo · Chino · Japonés ·
          Budista
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div
        v-for="c in calendars"
        :key="c.id"
        class="p-4 rounded-xl bg-white dark:bg-slate-800/50 border dark:border-slate-700"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-semibold">{{ c.name }}</span>
          <span
            v-if="c.experimental"
            class="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400"
          >
            ⚠️ Experimental
          </span>
          <span
            v-else
            class="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400"
          >
            Exacto
          </span>
        </div>
        <div class="space-y-1 text-xs">
          <p>
            <span class="text-slate-400">Mes 1:</span>
            <span class="font-mono font-medium">{{ c.monthName }}</span>
          </p>
          <p>
            <span class="text-slate-400">¿Año {{ year }} bisiesto?:</span>
            <span class="font-mono font-medium">{{
              c.isLeap ? 'Sí' : 'No'
            }}</span>
          </p>
          <p>
            <span class="text-slate-400">Días en mes 2:</span>
            <span class="font-mono font-medium">{{ c.daysInMonth }}</span>
          </p>
          <p>
            <span class="text-slate-400">Días en el año:</span>
            <span class="font-mono font-medium">{{ c.daysInYear }}</span>
          </p>
        </div>
      </div>
    </div>

    <div
      class="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-400"
    >
      Islámico, Hebreo y Chino usan aproximaciones simplificadas (ver
      <code class="font-mono">@experimental</code> en
      <code class="font-mono">src/calendars/index.ts</code>) — no son válidos
      para fechas religiosas o civiles oficiales.
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  GregorianCalendar,
  IslamicCalendar,
  HebrewCalendar,
  ChineseCalendar,
  JapaneseCalendar,
  BuddhistCalendar,
} from '@bereasoftware/time-guard';

const year = 2026;

const definitions = [
  { id: 'gregory', instance: new GregorianCalendar(), experimental: false },
  { id: 'islamic', instance: new IslamicCalendar(), experimental: true },
  { id: 'hebrew', instance: new HebrewCalendar(), experimental: true },
  { id: 'chinese', instance: new ChineseCalendar(), experimental: true },
  { id: 'japanese', instance: new JapaneseCalendar(), experimental: false },
  { id: 'buddhist', instance: new BuddhistCalendar(), experimental: false },
];

const calendars = definitions.map(({ id, instance, experimental }) => ({
  id,
  experimental,
  name: instance.name,
  monthName: instance.getMonthName(1),
  isLeap: instance.isLeapYear(year),
  daysInMonth: instance.daysInMonth(year, 2),
  daysInYear: instance.daysInYear(year),
}));
</script>
