<script setup lang="ts">
import { computed, inject } from 'vue';
import { I18N_KEY, type I18nContext } from '@/i18n';
import type { Component } from 'vue';

const { t } = inject(I18N_KEY) as I18nContext;

const props = defineProps<{
  code: string;
  demo?: Component;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  demoProps?: Record<string, any>;
  fileName?: string;
  editorHeight?: string;
}>();

const editorHeight = computed(() => props.editorHeight ?? 'h-full');
</script>

<template>
  <div class="bg-white rounded-lg dark:bg-slate-950">
    <!-- Split view -->
    <div class="w-full flex flex-1 flex-col">
      <div
        :class="[
          editorHeight,
          'rounded p-2 bg-white dark:bg-slate-900 flex items-start justify-center',
        ]"
      >
        <div v-if="demo" class="w-full h-full">
          <component :is="demo" v-bind="demoProps" class="h-full" />
        </div>
        <div v-else class="text-sm text-slate-500">
          {{ t('demo.code_unavailable') }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Layout handled by Tailwind classes; no extra styles required */
</style>
