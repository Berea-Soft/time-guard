<script setup lang="ts">
import { ref, onMounted, watch, inject } from 'vue';
import { useRoute } from 'vue-router';
import { I18N_KEY, type I18nContext } from '@/i18n';
import CodeRunTabs from '@/components/CodeRunTabs.vue';
import type { Component } from 'vue';

const { t } = inject(I18N_KEY) as I18nContext;

const route = useRoute();
const demo = ref<Component>();
const code = ref<string>('');
const title = ref<string>(t('demos.fallback'));

// Lazy loaders for components and raw text
/* eslint-disable @typescript-eslint/no-explicit-any */
const componentModules = import.meta.glob('../examples/*.vue') as Record<
  string,
  () => Promise<any>
>;
/* eslint-enable @typescript-eslint/no-explicit-any */
const rawModules = import.meta.glob('../examples/*.vue', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

// Eagerly load metadata so we can support custom titles/slugs exported from components
/* eslint-disable @typescript-eslint/no-explicit-any */
const eagerModules = import.meta.glob('../examples/*.vue', {
  eager: true,
}) as Record<string, any>;
/* eslint-enable @typescript-eslint/no-explicit-any */

function fileNameToSlug(fileName: string) {
  return fileName
    .replace(/\.vue$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

const registry = Object.keys(eagerModules).map((p) => {
  const m = eagerModules[p] ?? {};
  const file = p.split('/').pop() || '';
  const fileName = file.replace(/\.vue$/, '');
  const title =
    m.title ?? m.meta?.title ?? m.default?.title ?? m.default?.name ?? fileName;
  const slugSource =
    m.slug ?? m.meta?.slug ?? m.default?.slug ?? title ?? fileName;
  const slug = fileNameToSlug(slugSource);
  return { path: p, fileName, title, slug };
});

async function loadDemoBySlug(slug: string) {
  let entry = registry.find((r) => r.slug === slug);
  if (!entry) {
    entry = registry.find(
      (r) =>
        r.fileName.replace(/\.vue$/, '').toLowerCase() === slug.toLowerCase(),
    );
  }
  if (!entry) {
    entry = registry[0];
  }

  const foundPath = entry.path;
  const loader = componentModules[foundPath];
  const mod = await loader();
  demo.value = mod.default || mod;
  title.value = entry.title || mod.default?.name || entry.fileName;

  const rawKey = foundPath;
  const rawContent = rawModules[rawKey];
  if (rawContent) {
    code.value = rawContent;
  } else {
    try {
      // Fallback dynamic import for unusual environments
      const raw = await import(/* @vite-ignore */ foundPath + '?raw');
      code.value = raw.default ?? raw;
    } catch {
      code.value = t('demos.code_unavailable');
    }
  }
}

onMounted(async () => {
  await loadDemoBySlug((route.params.slug as string) || '');
});

watch(
  () => route.params.slug,
  async (val) => {
    if (val) {
      await loadDemoBySlug(val as string);
    }
  },
);
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">{{ title }}</h2>
      <router-link to="/demos" class="text-sm text-slate-500 hover:underline">{{
        t('demos.back')
      }}</router-link>
    </div>

    <div>
      <CodeRunTabs :code="code" :demo="demo" :fileName="title + '.vue'" />
    </div>
  </div>
</template>
