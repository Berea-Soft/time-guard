<script setup lang="ts">
import { computed, watch, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { I18N_KEY, type I18nContext } from '@/i18n';
import DocSection from '@/components/DocSection.vue';
import { DOCS_DATA } from '@/data/docs.data';

const { t } = inject(I18N_KEY)! as I18nContext;
const route = useRoute();
const router = useRouter();

// Flatten all items from all categories
const allItems = DOCS_DATA.flatMap((cat) =>
  cat.items.map((item) => ({ ...item, categoryTitle: cat.title })),
);

const docItem = computed(() => {
  const slug = route.params.slug as string;
  return allItems.find((item) => item.id === slug) ?? null;
});

// Watch for route changes — redirect if slug is invalid
watch(
  () => route.params.slug,
  (slug) => {
    if (slug && !allItems.find((item) => item.id === slug)) {
      router.replace('/docs');
    }
  },
  { immediate: true },
);
</script>

<template>
  <div v-if="docItem" class="space-y-8">
    <!-- Breadcrumb -->
    <nav
      class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"
    >
      <router-link
        to="/docs"
        class="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >{{ t('docs.breadcrumb.docs') }}</router-link
      >
      <span>/</span>
      <span class="text-slate-700 dark:text-slate-300">{{
        docItem.categoryTitle
      }}</span>
      <span>/</span>
      <span class="text-brand-600 dark:text-brand-400 font-medium">{{
        docItem.title
      }}</span>
    </nav>

    <!-- Doc content -->
    <DocSection :item="docItem" />
  </div>
  <div
    v-else
    class="flex flex-col items-center justify-center py-24 text-center"
  >
    <div class="text-6xl mb-4 opacity-30">📄</div>
    <h2 class="text-xl font-bold text-slate-600 dark:text-slate-400 mb-2">
      {{ t('docs.not_found.title') }}
    </h2>
    <p class="text-sm text-slate-400 dark:text-slate-500 mb-6">
      {{ t('docs.not_found.description') }}
    </p>
    <router-link
      to="/docs"
      class="px-5 py-2.5 text-sm font-semibold rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors"
    >
      {{ t('docs.not_found.back') }}
    </router-link>
  </div>
</template>
