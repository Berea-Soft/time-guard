<script setup lang="ts">
import { inject } from 'vue';
import { I18N_KEY, type I18nContext } from '@/i18n';

const { t } = inject(I18N_KEY) as I18nContext;
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="p-4 bg-white dark:bg-slate-900 rounded-lg shadow">
      <h4 class="font-semibold">{{ t('docs.highlights.core') }}</h4>
      <p class="text-sm text-slate-500 mt-2">
        {{ t('docs.highlights.core_desc') }}
      </p>
      <pre
        class="mt-3 bg-slate-100 dark:bg-slate-800 p-2 rounded text-xs font-mono"
      >
TimeGuard.now().format('time')</pre
      >
    </div>

    <div class="p-4 bg-white dark:bg-slate-900 rounded-lg shadow">
      <h4 class="font-semibold">{{ t('docs.highlights.locales') }}</h4>
      <p class="text-sm text-slate-500 mt-2">
        {{ t('docs.highlights.locales_desc') }}
      </p>
      <pre
        class="mt-3 bg-slate-100 dark:bg-slate-800 p-2 rounded text-xs font-mono"
      >
LocaleManager.set('es')</pre
      >
    </div>

    <div class="p-4 bg-white dark:bg-slate-900 rounded-lg shadow">
      <h4 class="font-semibold">{{ t('docs.highlights.plugins') }}</h4>
      <p class="text-sm text-slate-500 mt-2">
        {{ t('docs.highlights.plugins_desc') }}
      </p>
      <pre
        class="mt-3 bg-slate-100 dark:bg-slate-800 p-2 rounded text-xs font-mono"
      >
import 'time-guard/plugins/relative-time'</pre
      >
    </div>
  </div>
</template>
