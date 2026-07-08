<script lang="ts">
/**
 * Real, live-running Vue example — executes the actual
 * @bereasoftware/time-guard/vue composables inside a StackBlitz sandbox (see
 * FrameworkSandbox.vue), same treatment as the other 6 frameworks.
 * The source of truth lives in ./_sources/VueDemoSource.vue, read via Vite's
 * `?raw` loader — avoids re-typing/escaping the code as a JS string.
 */
import codeRaw from './_sources/VueDemoSource.vue?raw';
export const code = codeRaw;
export const title = 'Vue';
export const slug = 'vue-demo';
</script>

<script setup lang="ts">
import FrameworkSandbox from '@/components/FrameworkSandbox.vue';
</script>

<template>
  <FrameworkSandbox framework="vue" :code="code" title="TimeGuard · Vue" />
</template>
