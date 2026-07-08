<script lang="ts">
/**
 * Real, live-running business-days example — executes inside a StackBlitz
 * sandbox (see FrameworkSandbox.vue), same treatment as the other framework
 * demos. Source of truth lives in ./_sources/BusinessDayDemoSource.vue,
 * read via Vite's `?raw` loader.
 */
import codeRaw from './_sources/BusinessDayDemoSource.vue?raw';
export const code = codeRaw;
export const title = 'Días Laborables y Feriados';
export const slug = 'business-day-demo';
</script>

<script setup lang="ts">
import FrameworkSandbox from '@/components/FrameworkSandbox.vue';
</script>

<template>
  <FrameworkSandbox
    framework="vue"
    :code="code"
    title="TimeGuard · Business Days"
  />
</template>
