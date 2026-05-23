<script setup lang="ts">
import { inject } from 'vue';
import { I18N_KEY, type I18nContext } from '@/i18n';

const { t } = inject(I18N_KEY) as I18nContext;
</script>

<template>
  <div
    class="mt-6 p-6 bg-gradient-to-r from-brand-600 to-sky-700 text-white rounded-lg flex items-center justify-between"
  >
    <div>
      <h3 class="text-xl font-bold">{{ t('docs.cta.title') }}</h3>
      <p class="text-sm opacity-90 mt-1">{{ t('docs.cta.description') }}</p>
    </div>

    <div class="flex items-center gap-3">
      <router-link
        to="/demos"
        class="px-4 py-2 bg-white text-brand-600 rounded-md font-semibold"
        >{{ t('docs.cta.examples') }}</router-link
      >
      <a
        href="https://github.com/Berea-Soft/time-guard"
        target="_blank"
        class="px-4 py-2 border border-white/30 rounded-md"
        >{{ t('docs.cta.github') }}</a
      >
    </div>
  </div>
</template>
