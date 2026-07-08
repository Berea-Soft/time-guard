<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <div
        class="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg"
      >
        ⏱
      </div>
      <div>
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">
          TimeRange Explorer
        </h3>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          Intersección · Unión · Superposición
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Range A -->
      <div
        class="p-4 rounded-xl bg-white dark:bg-slate-800/50 border dark:border-slate-700"
      >
        <p
          class="text-xs font-semibold uppercase tracking-wider text-sky-500 mb-2"
        >
          📅 Rango A
        </p>
        <p class="font-mono text-sm">20 mayo → 30 mayo</p>
        <div
          class="mt-2 h-4 rounded-full bg-sky-100 dark:bg-sky-900/30 relative overflow-hidden"
        >
          <div class="h-full w-[40%] rounded-full bg-sky-400"></div>
        </div>
        <p class="text-xs text-slate-400 mt-1">
          Duración: <span class="font-medium">{{ rangeADuration }}</span>
        </p>
      </div>

      <!-- Range B -->
      <div
        class="p-4 rounded-xl bg-white dark:bg-slate-800/50 border dark:border-slate-700"
      >
        <p
          class="text-xs font-semibold uppercase tracking-wider text-violet-500 mb-2"
        >
          📅 Rango B
        </p>
        <p class="font-mono text-sm">25 mayo → 5 junio</p>
        <div
          class="mt-2 h-4 rounded-full bg-violet-100 dark:bg-violet-900/30 relative overflow-hidden"
        >
          <div class="h-full w-[45%] rounded-full bg-violet-400 ml-[45%]"></div>
        </div>
        <p class="text-xs text-slate-400 mt-1">
          Duración: <span class="font-medium">{{ rangeBDuration }}</span>
        </p>
      </div>
    </div>

    <!-- Operations -->
    <div
      class="p-4 rounded-xl bg-white dark:bg-slate-800/50 border dark:border-slate-700"
    >
      <p
        class="text-xs font-semibold uppercase tracking-wider text-brand-500 mb-3"
      >
        ⚡ Operaciones
      </p>
      <div class="space-y-3 text-sm">
        <div
          class="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800"
        >
          <span class="text-slate-500">overlaps()</span>
          <span
            :class="rangeOverlaps ? 'text-green-500' : 'text-red-500'"
            class="font-semibold"
            >{{ rangeOverlaps ? 'true' : 'false' }}</span
          >
        </div>
        <div class="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800">
          <span class="text-slate-500">intersect()</span>
          <p class="font-mono text-xs mt-1">{{ rangeIntersect }}</p>
        </div>
        <div class="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800">
          <span class="text-slate-500">union()</span>
          <p class="font-mono text-xs mt-1">{{ rangeUnion }}</p>
        </div>
        <div class="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800">
          <span class="text-slate-500">contains(25 may)</span>
          <span
            :class="contains25 ? 'text-green-500' : 'text-red-500'"
            class="font-semibold ml-2"
            >{{ contains25 ? 'true' : 'false' }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TimeGuard, TimeRange } from '@bereasoftware/time-guard';

const startA = TimeGuard.from('2026-05-20').locale('es') as TimeGuard;
const endA = TimeGuard.from('2026-05-30').locale('es') as TimeGuard;
const startB = TimeGuard.from('2026-05-25').locale('es') as TimeGuard;
const endB = TimeGuard.from('2026-06-05').locale('es') as TimeGuard;

const rangeA = new TimeRange(startA, endA);
const rangeB = new TimeRange(startB, endB);

const rangeADuration = rangeA.toDuration().humanize({ locale: 'es' });
const rangeBDuration = rangeB.toDuration().humanize({ locale: 'es' });

const rangeOverlaps = rangeA.overlaps(rangeB);

const intersect = rangeA.intersect(rangeB);
const rangeIntersect = intersect
  ? `${intersect.start.format('DD MMM')} → ${intersect.end.format('DD MMM')}`
  : 'null';

const union = rangeA.union(rangeB);
const rangeUnion = `${union.start.format('DD MMM')} → ${union.end.format('DD MMM')}`;

const contains25 = rangeA.contains('2026-05-25');
</script>
