<script setup lang="ts">
import { ref, inject, toRef, computed, type Component } from 'vue';
import { Check, Copy, Code, Sparkles } from '@lucide/vue';
import type { DocItem } from '@/types';
import { I18N_KEY, type I18nContext } from '@/i18n';
import CodeEditor from '@/components/CodeEditor.vue';

// Demo components registry
import SvelteDemo from '@/examples/SvelteDemo.vue';
import SolidDemo from '@/examples/SolidDemo.vue';
import QwikDemo from '@/examples/QwikDemo.vue';
import ReactDemo from '@/examples/ReactDemo.vue';
import VueDemo from '@/examples/VueDemo.vue';
import AngularDemo from '@/examples/AngularDemo.vue';

const DEMO_REGISTRY: Record<string, Component> = {
  'svelte-demo': SvelteDemo,
  'solid-demo': SolidDemo,
  'qwik-demo': QwikDemo,
  'react-demo': ReactDemo,
  'vue-demo': VueDemo,
  'angular-demo': AngularDemo,
};

const { t } = inject(I18N_KEY) as I18nContext;

const props = defineProps<{ item: DocItem }>();
const item = toRef(props, 'item');

const demoComponent = computed(() => {
  const id = item.value?.demoComponentId;
  return id ? (DEMO_REGISTRY[id] ?? null) : null;
});

/** Limpia la indentación base del código inyectado */
function formatSnippet(code: string): string {
  const lines = code.split('\n');
  if (lines.length <= 1) {
    return code.trim();
  }

  const minIndent = lines
    .filter((l) => l.trim().length > 0)
    .reduce((min, line) => {
      const match = line.match(/^(\s*)/);
      const len = match ? match[1].length : 0;
      return len < min ? len : min;
    }, Infinity);

  return lines
    .map((line) => line.slice(minIndent === Infinity ? 0 : minIndent))
    .join('\n')
    .trim();
}

const copiedIndex = ref<number | null>(null);

const copyToClipboard = (text: string, index: number) => {
  navigator.clipboard.writeText(text).then(() => {
    copiedIndex.value = index;
    setTimeout(() => {
      copiedIndex.value = null;
    }, 2000);
  });
};

// Playground helpers removed (not used currently)
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

    <!-- Interactive Demo Component (si el item tiene demoComponentId) -->
    <div v-if="demoComponent" class="space-y-4">
      <div
        class="p-4 border bg-white/40 dark:bg-slate-900/30 rounded-2xl border-slate-200/60 dark:border-slate-800/60"
      >
        <div class="flex items-center gap-2 mb-4">
          <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span
            class="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400"
            >Demo Interactiva</span
          >
        </div>
        <component :is="demoComponent" />
      </div>
    </div>

    <!-- Code Examples List -->
    <div class="space-y-6">
      <!-- Standard TS Examples -->
      <div
        v-for="(eg, index) in item.examples"
        :key="eg.title"
        class="flex flex-col overflow-hidden border bg-white/40 dark:bg-slate-900/30 rounded-2xl border-slate-200/60 dark:border-slate-800/60"
      >
        <div
          class="flex items-center justify-between px-5 py-3.5 bg-slate-50/50 dark:bg-slate-950/40 border-b border-slate-200/60 dark:border-slate-800/60"
        >
          <div class="flex items-center space-x-2">
            <Code class="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <div>
              <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200">
                {{ eg.title }}
              </h4>
              <p class="text-[10px] text-slate-500 dark:text-slate-300 mt-0.5">
                {{ eg.description }}
              </p>
            </div>
          </div>

          <button
            @click="copyToClipboard(eg.code, index)"
            class="p-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800/80 active:scale-95 transition-all duration-200 flex items-center space-x-1 shadow-sm"
          >
            <Check
              v-if="copiedIndex === index"
              class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse"
            />
            <Copy v-else class="w-3.5 h-3.5" />
            <span class="text-[10px] px-0.5 font-medium">{{
              copiedIndex === index
                ? t('doc_section.copied')
                : t('doc_section.copy')
            }}</span>
          </button>
        </div>

        <div class="h-auto overflow-auto min-h-25 max-h-105">
          <CodeEditor
            :files="{ 'main.ts': formatSnippet(eg.code) }"
            active-file="main.ts"
            read-only
          />
        </div>
      </div>
    </div>
  </div>
</template>
