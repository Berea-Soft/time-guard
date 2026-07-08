<script lang="ts">
/**
 * Real, live-running TimeRange example — executes inside a StackBlitz
 * sandbox (see FrameworkSandbox.vue), same treatment as the other framework
 * demos. Source of truth lives in ./_sources/TimeRangeDemoSource.vue, read
 * via Vite's `?raw` loader.
 */
import codeRaw from './_sources/TimeRangeDemoSource.vue?raw';
export const code = codeRaw;
export const title = 'Rangos de Tiempo (TimeRange)';
export const slug = 'time-range-demo';
</script>

<script setup lang="ts">
import FrameworkSandbox from '@/components/FrameworkSandbox.vue';
</script>

<template>
  <FrameworkSandbox
    framework="vue"
    :code="code"
    title="TimeGuard · TimeRange"
  />
</template>
