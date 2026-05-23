<script setup lang="ts">
import { inject } from 'vue';
import { I18N_KEY, type I18nContext } from '@/i18n';
import DocsHero from '@/components/docs/DocsHero.vue';
import DocsQuickStart from '@/components/docs/DocsQuickStart.vue';
import DocsAPIHighlights from '@/components/docs/DocsAPIHighlights.vue';
import DocsCTA from '@/components/docs/DocsCTA.vue';
import { DOCS_DATA } from '@/data/docs.data';

const { t } = inject(I18N_KEY) as I18nContext;
</script>

<template>
  <div class="space-y-12">
    <DocsHero />

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div class="lg:col-span-2">
        <DocsQuickStart />
      </div>
      <div class="lg:col-span-2">
        <DocsAPIHighlights />
      </div>
    </div>

    <DocsCTA />

    <!-- Table of Contents: all doc items as cards -->
    <div class="pb-8 space-y-12">
      <div v-for="cat in DOCS_DATA" :key="cat.id" class="space-y-4">
        <h2
          class="text-xl font-bold font-display text-slate-800 dark:text-slate-200"
        >
          {{ cat.title }}
        </h2>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <router-link
            v-for="item in cat.items"
            :key="item.id"
            :to="'/docs/' + item.id"
            class="p-4 transition-all duration-200 bg-white border group rounded-xl border-slate-200 dark:border-slate-800 dark:bg-slate-900/60 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md hover:shadow-brand-500/5"
          >
            <h3
              class="text-sm font-semibold transition-colors text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400"
            >
              {{ item.title }}
            </h3>
            <p
              v-if="item.subtitle"
              class="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2"
            >
              {{ item.subtitle }}
            </p>
            <div
              class="flex items-center gap-1.5 mt-2 text-[10px] text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span>{{ t('docs.overview.view_doc') }}</span>
              <span>→</span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
