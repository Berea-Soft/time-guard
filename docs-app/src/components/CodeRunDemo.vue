<script setup lang="ts">
import { inject } from 'vue';
import { I18N_KEY, type I18nContext } from '@/i18n';
import CodeRunTabs from '@/components/CodeRunTabs.vue';
import Demo from '@/examples/MyExample.vue';
import demoCode from '@/examples/MyExample.vue?raw';

const { t } = inject(I18N_KEY) as I18nContext;
</script>

<template>
  <div class="w-full pt-4">
    <CodeRunTabs
      :code="demoCode"
      :demo="Demo"
      :demoProps="{ msg: t('demo_component.hello') }"
      fileName="/MyExample.vue"
      editorHeight="h-[520px]"
    />
  </div>
</template>
