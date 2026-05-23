<script setup lang="ts">
import { inject } from 'vue';
import { I18N_KEY, type I18nContext } from '@/i18n';
import CodeEditor from './CodeEditor.vue';
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

const fileName = props.fileName ?? '/Demo.vue';
const editorHeight = props.editorHeight ?? 'h-96';
</script>

<template>
  <div
    class="min-h-screen overflow-hidden bg-white rounded-lg dark:bg-slate-950"
  >
    <!-- Split view -->
    <div class="flex flex-col h-full md:flex-row">
      <div class="p-2 md:w-1/2">
        <div :class="[editorHeight, 'rounded overflow-hidden']">
          <CodeEditor
            :files="{ [fileName]: code }"
            :activeFile="fileName"
            :readOnly="true"
          />
        </div>
      </div>

      <div class="p-2 md:w-1/2">
        <div
          :class="[
            editorHeight,
            'rounded p-4 bg-white dark:bg-slate-900 flex items-start justify-center',
          ]"
        >
          <div v-if="demo" class="w-full">
            <component :is="demo" v-bind="demoProps" />
          </div>
          <div v-else class="text-sm text-slate-500">
            {{ t('demo.code_unavailable') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Layout handled by Tailwind classes; no extra styles required */
</style>
