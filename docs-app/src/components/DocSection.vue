<script setup lang="ts">
import { inject, toRef, computed, type Component } from 'vue';
import { Sparkles } from '@lucide/vue';
import type { DocItem } from '@/types';
import { I18N_KEY, type I18nContext } from '@/i18n';
import FrameworkSandbox from '@/components/FrameworkSandbox.vue';

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

// Renders a live StackBlitz sandbox for items with `playground.enabled`
// (the "Frameworks Playground" section, plus the i18n "runner" example) — see
// FrameworkSandbox.vue. `mode: 'app'` items ship a framework-specific full
// component; `mode: 'runner'` items ship a generic TS snippet wrapped in a
// universal console.log runner (defaults to the 'vanilla' template).
const playgroundSandbox = computed(() => {
  const pg = item.value?.playground;
  if (!pg?.enabled) {
    return null;
  }
  const code = item.value?.examples?.[pg.exampleIndex ?? 0]?.code;
  if (!code) {
    return null;
  }
  return {
    framework: pg.framework ?? 'vanilla',
    mode: pg.mode ?? 'runner',
    code,
  };
});

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

    <!-- Live StackBlitz Playground (si el item tiene playground.enabled) -->
    <div v-if="playgroundSandbox" class="space-y-4">
      <div
        class="p-4 border bg-white/40 dark:bg-slate-900/30 rounded-2xl border-slate-200/60 dark:border-slate-800/60"
      >
        <div class="flex items-center gap-2 mb-4">
          <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span
            class="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400"
            >Playground StackBlitz</span
          >
        </div>
        <FrameworkSandbox
          :framework="playgroundSandbox.framework"
          :mode="playgroundSandbox.mode"
          :code="playgroundSandbox.code"
          :title="item.title"
        />
      </div>
    </div>

    <!-- Static code block fallback: items without a playground (ej. Native
    Mode, que no puede asumir que el sandbox tenga Temporal global) todavía
    necesitan mostrar su(s) ejemplo(s) — sin esto, `item.examples` nunca se
    renderiza en ningún lado. -->
    <div v-else-if="item.examples?.length" class="space-y-4">
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
        <pre
          class="overflow-x-auto p-3 text-xs rounded-xl bg-slate-950 text-slate-100"
        ><code>{{ example.code }}</code></pre>
      </div>
    </div>
  </div>
</template>
