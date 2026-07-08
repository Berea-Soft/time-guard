<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <div
        class="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg"
      >
        🌍
      </div>
      <div>
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">
          Locales e Idiomas
        </h3>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          {{ localesCount }} locales · loadAllLocales() · formateo nativo por
          idioma
        </p>
      </div>
    </div>

    <div
      class="p-3 rounded-xl bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 text-xs text-sky-700 dark:text-sky-300"
    >
      El core solo trae <code class="font-mono">en</code>/<code
        class="font-mono"
        >es</code
      >
      por defecto — esta demo llama
      <code class="font-mono">loadAllLocales()</code> una vez para registrar los
      {{ localesCount }} disponibles.
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div
        v-for="l in samples"
        :key="l.code"
        class="p-4 rounded-xl bg-white dark:bg-slate-800/50 border dark:border-slate-700"
      >
        <div class="flex items-center justify-between mb-1.5">
          <span
            class="text-xs font-semibold uppercase tracking-wider text-sky-500"
          >
            {{ l.name }}
          </span>
          <span
            class="px-2 py-0.5 text-[10px] font-mono rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300"
          >
            {{ l.code }}
          </span>
        </div>
        <p class="font-medium text-sm">{{ l.long }}</p>
        <p class="text-xs text-slate-400 mt-0.5 font-mono">{{ l.numeric }}</p>
      </div>
    </div>

    <!-- Relative time per locale -->
    <div
      class="p-4 rounded-xl bg-white dark:bg-slate-800/50 border dark:border-slate-700"
    >
      <p
        class="text-xs font-semibold uppercase tracking-wider text-indigo-500 mb-3"
      >
        ⏳ "Hace 3 días" en cada idioma
      </p>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
        <div
          v-for="l in samples"
          :key="l.code"
          class="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 font-mono"
        >
          {{ l.relative }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  TimeGuard,
  loadAllLocales,
  getAvailableLocales,
} from '@bereasoftware/time-guard';

// Register every bundled locale (core only ships en/es by default).
loadAllLocales();

const localesCount = getAvailableLocales().length;

const date = TimeGuard.from('2026-05-20T10:30:00');
const past = TimeGuard.now().subtract({ day: 3 });
const now = TimeGuard.now();

const codes: Array<{ code: string; name: string }> = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語' },
  { code: 'ar', name: 'العربية' },
  { code: 'zh-cn', name: '简体中文' },
  { code: 'ru', name: 'Русский' },
  { code: 'pt-br', name: 'Português (BR)' },
  { code: 'sw', name: 'Kiswahili' },
];

const samples = codes.map(({ code, name }) => ({
  code,
  name,
  long: date.locale(code).format('dddd, DD MMMM YYYY'),
  numeric: date.locale(code).format('DD/MM/YYYY HH:mm'),
  relative: past.since(now).humanize({ locale: code }),
}));
</script>
