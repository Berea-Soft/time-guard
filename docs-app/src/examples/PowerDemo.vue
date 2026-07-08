<script lang="ts">
/**
 * Real, live-running example exercising the full TimeGuard surface —
 * executes inside a StackBlitz sandbox (see FrameworkSandbox.vue), same
 * treatment as the other framework demos. Source of truth lives in
 * ./_sources/PowerDemoSource.vue, read via Vite's `?raw` loader.
 */
import codeRaw from './_sources/PowerDemoSource.vue?raw';
export const code = codeRaw;
export const title = 'API Completa';
export const slug = 'power-demo';
</script>

<script setup lang="ts">
import FrameworkSandbox from '@/components/FrameworkSandbox.vue';
</script>

<template>
  <FrameworkSandbox
    framework="vue"
    :code="code"
    title="TimeGuard · API Completa"
  />
</template>
