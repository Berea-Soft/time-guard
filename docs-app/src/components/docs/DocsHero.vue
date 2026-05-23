<script setup lang="ts">
import { inject } from 'vue';
import { RouterLink } from 'vue-router';
import { I18N_KEY, type I18nContext } from '@/i18n';

const { t } = inject(I18N_KEY) as I18nContext;
</script>

<template>
  <div
    class="relative p-8 overflow-hidden glass-card bg-linear-to-tr from-white to-slate-50 dark:from-slate-900/70 dark:to-slate-900/35 border-slate-200 dark:border-slate-800/80"
  >
    <div
      class="absolute rounded-full -right-16 -top-16 w-36 h-36 bg-brand-500/10 blur-3xl"
    ></div>

    <div class="relative max-w-4xl space-y-4">
      <h1
        class="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900 dark:text-white"
      >
        {{ t('docs.hero.title') }}
      </h1>
      <p class="text-lg text-slate-600 dark:text-slate-400">
        {{ t('docs.hero.description') }}
      </p>

      <div class="flex items-center gap-3 mt-4">
        <router-link
          to="/demos"
          class="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold transition-all duration-300 rounded-lg bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-500 hover:to-sky-500 text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 hover:scale-105 active:scale-95"
        >
          {{ t('docs.hero.cta_demos') }}
        </router-link>
      </div>
    </div>
  </div>
</template>
