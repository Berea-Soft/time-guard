<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <div
        class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-violet-500 flex items-center justify-center text-white font-bold text-lg"
      >
        TG
      </div>
      <div>
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">
          TimeGuard Power Demo
        </h3>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          Formateo · Aritmética · Tiempo Relativo · Rangos
        </p>
      </div>
    </div>

    <!-- Real-time clock -->
    <div
      class="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white text-center"
    >
      <p class="text-xs uppercase tracking-widest text-slate-400 mb-1">Ahora</p>
      <p class="text-3xl font-mono font-bold">{{ liveTime }}</p>
      <p class="text-sm text-slate-400 mt-1">{{ liveDate }}</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Date arithmetic -->
      <div
        class="p-4 rounded-xl bg-white dark:bg-slate-800/50 border dark:border-slate-700"
      >
        <p
          class="text-xs font-semibold uppercase tracking-wider text-brand-500 mb-2"
        >
          📅 Aritmética
        </p>
        <div class="space-y-1.5 text-sm">
          <p>
            <span class="text-slate-400">Hoy:</span>
            <span class="font-mono font-medium">{{ todayStr }}</span>
          </p>
          <p>
            <span class="text-slate-400">+7 días:</span>
            <span class="font-mono font-medium">{{ plus7 }}</span>
          </p>
          <p>
            <span class="text-slate-400">-1 mes:</span>
            <span class="font-mono font-medium">{{ minus1Month }}</span>
          </p>
          <p>
            <span class="text-slate-400">+1 año:</span>
            <span class="font-mono font-medium">{{ plus1Year }}</span>
          </p>
        </div>
      </div>

      <!-- Relative time -->
      <div
        class="p-4 rounded-xl bg-white dark:bg-slate-800/50 border dark:border-slate-700"
      >
        <p
          class="text-xs font-semibold uppercase tracking-wider text-brand-500 mb-2"
        >
          ⏳ Tiempo Relativo
        </p>
        <div class="space-y-1.5 text-sm">
          <p>
            <span class="text-slate-400">Ayer:</span>
            <span class="font-mono font-medium">{{ yesterdayRelative }}</span>
          </p>
          <p>
            <span class="text-slate-400">Mañana:</span>
            <span class="font-mono font-medium">{{ tomorrowRelative }}</span>
          </p>
          <p>
            <span class="text-slate-400">Hace 2h:</span>
            <span class="font-mono font-medium">{{ twoHoursAgoRelative }}</span>
          </p>
          <p>
            <span class="text-slate-400">En 3d:</span>
            <span class="font-mono font-medium">{{ threeDaysRelative }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Boolean queries -->
    <div
      class="p-4 rounded-xl bg-white dark:bg-slate-800/50 border dark:border-slate-700"
    >
      <p
        class="text-xs font-semibold uppercase tracking-wider text-brand-500 mb-3"
      >
        ✅ Consultas Booleanas
      </p>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div
          v-for="q in queries"
          :key="q.label"
          class="px-3 py-2 rounded-lg text-center text-xs font-medium"
          :class="
            q.value
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
          "
        >
          {{ q.label }}: {{ q.value ? '✓' : '✗' }}
        </div>
      </div>
    </div>

    <!-- Duration -->
    <div
      class="p-4 rounded-xl bg-white dark:bg-slate-800/50 border dark:border-slate-700"
    >
      <p
        class="text-xs font-semibold uppercase tracking-wider text-brand-500 mb-2"
      >
        📊 DurationResult
      </p>
      <p class="text-sm mb-2">
        <span class="text-slate-400">De </span>
        <span class="font-mono font-medium">{{ duration.start }}</span>
        <span class="text-slate-400"> a </span>
        <span class="font-mono font-medium">{{ duration.end }}</span>
      </p>
      <div class="text-sm space-y-1">
        <p>
          <span class="text-slate-400">Humanizado:</span>
          <span class="font-medium">{{ duration.humanized }}</span>
        </p>
        <p>
          <span class="text-slate-400">Total días:</span>
          <span class="font-mono font-medium"
            >{{ duration.totalDays }} días</span
          >
        </p>
        <p>
          <span class="text-slate-400">Total horas:</span>
          <span class="font-mono font-medium"
            >{{ duration.totalHours }} hrs</span
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { TimeGuard } from '@bereasoftware/time-guard';

// Real-time clock
const now = ref<TimeGuard>(TimeGuard.now().locale('es'));
let timer: number | null = null;
onMounted(() => {
  timer = window.setInterval(() => {
    now.value = TimeGuard.now().locale('es');
  }, 1000);
});
onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});

const liveTime = computed(() => (now.value as TimeGuard).format('HH:mm:ss'));
const liveDate = computed(() =>
  (now.value as TimeGuard).format('dddd, DD MMMM YYYY'),
);

// Arithmetic
const today = computed(() => TimeGuard.now().locale('es'));
const todayStr = computed(() => today.value.format('YYYY-MM-DD'));
const plus7 = computed(() =>
  today.value.add({ day: 7 }).locale('es').format('ddd DD MMM'),
);
const minus1Month = computed(() =>
  today.value.subtract({ month: 1 }).locale('es').format('ddd DD MMM'),
);
const plus1Year = computed(() =>
  today.value.add({ year: 1 }).locale('es').format('ddd DD MMM YYYY'),
);

// Relative
const nowVal = computed(() => now.value as TimeGuard);
const yesterdayRelative = computed(() =>
  today.value
    .subtract({ day: 1 })
    .since(nowVal.value)
    .humanize({ locale: 'es', numeric: 'auto' }),
);
const tomorrowRelative = computed(() =>
  today.value
    .add({ day: 1 })
    .since(nowVal.value)
    .humanize({ locale: 'es', numeric: 'auto' }),
);
const twoHoursAgoRelative = computed(() =>
  nowVal.value
    .subtract({ hour: 2 })
    .since(nowVal.value)
    .humanize({ locale: 'es' }),
);
const threeDaysRelative = computed(() =>
  nowVal.value.add({ day: 3 }).since(nowVal.value).humanize({ locale: 'es' }),
);

// Boolean queries
const sampleDate = TimeGuard.from('2026-05-20').locale('es') as TimeGuard;
const queries = computed(() => [
  { label: 'isPast', value: sampleDate.isPast() as boolean },
  { label: 'isToday', value: sampleDate.isToday() as boolean },
  { label: 'inLeapYear', value: sampleDate.inLeapYear() as boolean },
  { label: 'isWeekend', value: (sampleDate.isWeekend?.() ?? false) as boolean },
]);

// Duration
const durStart = TimeGuard.from('2024-01-15').locale('es') as TimeGuard;
const durEnd = TimeGuard.from('2026-05-20').locale('es') as TimeGuard;
const durationResult = computed(() => durStart.until(durEnd));
const duration = computed(() => ({
  start: durStart.format('DD MMM YYYY'),
  end: durEnd.format('DD MMM YYYY'),
  humanized: durationResult.value.humanize({
    locale: 'es',
    fullBreakdown: true,
  }),
  totalDays: durationResult.value.total('day').toFixed(0),
  totalHours: durationResult.value.total('hour').toFixed(0),
}));
</script>
