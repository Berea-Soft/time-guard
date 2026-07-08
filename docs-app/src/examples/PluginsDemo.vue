<script lang="ts">
/**
 * Real, live-running plugins example — executes inside a StackBlitz sandbox
 * (see FrameworkSandbox.vue), same treatment as the other framework demos.
 * Source of truth lives in ./_sources/PluginsDemoSource.vue, read via
 * Vite's `?raw` loader.
 */
import codeRaw from './_sources/PluginsDemoSource.vue?raw';
export const code = codeRaw;
export const title = 'Sistema de Plugins';
export const slug = 'plugins-demo';
</script>

<script setup lang="ts">
import FrameworkSandbox from '@/components/FrameworkSandbox.vue';
</script>

<template>
  <FrameworkSandbox framework="vue" :code="code" title="TimeGuard · Plugins" />
</template>
