<script setup lang="ts">
import { inject } from 'vue';
import { I18N_KEY, type I18nContext } from '@/i18n';

const { t } = inject(I18N_KEY) as I18nContext;

// Eagerly import demo modules to build a list at runtime/build-time
/* eslint-disable @typescript-eslint/no-explicit-any */
const modules = import.meta.glob('../examples/*.vue', {
  eager: true,
}) as Record<string, any>;
/* eslint-enable @typescript-eslint/no-explicit-any */

function fileNameToSlug(fileName: string) {
  return fileName
    .replace(/\.vue$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

const demos = Object.keys(modules)
  .map((p) => {
    const mod = modules[p] ?? {};
    const file = p.split('/').pop() || '';
    const fileName = file.replace(/\.vue$/, '');
    const title =
      mod.title ??
      mod.meta?.title ??
      mod.default?.title ??
      mod.default?.name ??
      fileName;
    const slugSource =
      mod.slug ?? mod.meta?.slug ?? mod.default?.slug ?? title ?? fileName;
    const slug = fileNameToSlug(slugSource);
    return { fileName, slug, title, path: p };
  })
  .sort((a, b) => a.title.localeCompare(b.title));
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold">{{ t('demos.title') }}</h2>
    <p class="text-sm text-slate-600 dark:text-slate-400">
      {{ t('demos.description') }}
    </p>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <router-link
        v-for="demo in demos"
        :key="demo.slug"
        :to="`/demos/${demo.slug}`"
        class="p-5 transition-all duration-200 bg-white border group rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900/60 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md hover:shadow-brand-500/5"
      >
        <h3
          class="text-sm font-semibold transition-colors text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400"
        >
          {{ demo.title }}
        </h3>
        <div
          class="flex items-center gap-1.5 mt-3 text-xs text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <span>{{ t('demos.back') }}</span>
          <span>→</span>
        </div>
      </router-link>
    </div>
  </div>
</template>
