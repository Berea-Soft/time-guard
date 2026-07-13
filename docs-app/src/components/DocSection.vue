<script setup lang="ts">
import { inject, toRef, computed } from 'vue';
import { Sparkles, PlayCircle } from '@lucide/vue';
import type { DocItem } from '@/types';
import { I18N_KEY, type I18nContext } from '@/i18n';
import DocCodeBlock from '@/components/DocCodeBlock.vue';

const { t } = inject(I18N_KEY) as I18nContext;

const props = defineProps<{ item: DocItem }>();
const item = toRef(props, 'item');

// La documentación es solo texto + fragmentos de código estáticos — los
// sandboxes de StackBlitz viven exclusivamente en /demos (ver DemoPage.vue).
// Si el item referencia un demo, solo enlazamos a él en vez de embeberlo.
const demoLink = computed(() => {
  const id = item.value?.demoComponentId;
  return id ? `/demos/${id}` : null;
});
</script>

<template>
  <div v-if="item" :id="item.id" class="space-y-6 scroll-mt-24">
    <!-- Title & Subtitle Header -->
    <div class="space-y-1.5">
      <h2
        class="flex items-center gap-2 text-2xl font-bold tracking-tight font-display text-slate-900 dark:text-slate-100"
      >
        {{ item.title }}
      </h2>
      <p
        v-if="item.subtitle"
        class="text-sm font-medium text-brand-600 dark:text-brand-400"
      >
        {{ item.subtitle }}
      </p>
    </div>

    <!-- Description -->
    <p
      class="max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300"
    >
      {{ item.description }}
    </p>

    <!-- Key Features Checklist -->
    <div
      v-if="item.features && item.features.length > 0"
      class="p-4 space-y-2 border bg-white/50 dark:bg-slate-900/40 rounded-2xl border-slate-200 dark:border-slate-800/80"
    >
      <h4
        class="text-xs font-semibold text-slate-500 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5"
      >
        <Sparkles class="w-3.5 h-3.5 text-brand-500 dark:text-brand-400" />
        {{ t('doc_section.features_title') }}
      </h4>
      <ul
        class="grid grid-cols-1 gap-2 pt-1 text-xs md:grid-cols-2 text-slate-600 dark:text-slate-300"
      >
        <li
          v-for="feat in item.features"
          :key="feat"
          class="flex items-center space-x-2"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
          <span>{{ feat }}</span>
        </li>
      </ul>
    </div>

    <!-- Enlace al demo en vivo (si el item referencia uno) — el sandbox de
    StackBlitz en sí solo vive en /demos, aquí solo apuntamos hacia él. -->
    <router-link
      v-if="demoLink"
      :to="demoLink"
      class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors border rounded-xl border-brand-200 dark:border-brand-800/60 text-brand-600 dark:text-brand-400 bg-brand-50/60 dark:bg-brand-950/30 hover:bg-brand-100 dark:hover:bg-brand-900/40"
    >
      <PlayCircle class="w-4 h-4" />
      {{ t('doc_section.view_live_demo') }}
    </router-link>

    <!-- Static code block: muestra los ejemplos del item como texto + código,
    sin ningún sandbox embebido. -->
    <div v-if="item.examples?.length" class="space-y-4">
      <div
        v-for="example in item.examples"
        :key="example.title"
        class="p-4 space-y-2 border bg-white/40 dark:bg-slate-900/30 rounded-2xl border-slate-200/60 dark:border-slate-800/60"
      >
        <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {{ example.title }}
        </p>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          {{ example.description }}
        </p>
        <DocCodeBlock :code="example.code" />
      </div>
    </div>
  </div>
</template>
