<script setup lang="ts">
import { inject } from 'vue';
import { I18N_KEY, type I18nContext } from '@/i18n';

const { t } = inject(I18N_KEY) as I18nContext;
</script>

<template>
  <div class="p-6 bg-white dark:bg-slate-900 rounded-lg shadow">
    <h3 class="text-lg font-semibold">{{ t('docs.quickstart.title') }}</h3>
    <p class="text-sm text-slate-600 dark:text-slate-400 mt-2">
      {{ t('docs.quickstart.description') }}
    </p>

    <div class="mt-4 space-y-3 font-mono text-sm">
      <div class="bg-slate-100 dark:bg-slate-800 p-3 rounded">
        pnpm add @bereasoftware/time-guard
      </div>
      <pre
        class="bg-slate-900 text-white p-3 rounded overflow-auto"
      ><code>import TimeGuard from '@bereasoftware/time-guard';

const now = TimeGuard.now();
console.log(now.format('time'));</code></pre>
    </div>
  </div>
</template>
