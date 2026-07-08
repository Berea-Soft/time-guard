<script lang="ts">
/**
 * Real, live-running locales example — executes inside a StackBlitz sandbox
 * (see FrameworkSandbox.vue), same treatment as the other framework demos.
 * Source of truth lives in ./_sources/LocalesDemoSource.vue, read via
 * Vite's `?raw` loader.
 */
import codeRaw from './_sources/LocalesDemoSource.vue?raw';
export const code = codeRaw;
export const title = 'Locales e Idiomas';
export const slug = 'locales-demo';
</script>

<script setup lang="ts">
import FrameworkSandbox from '@/components/FrameworkSandbox.vue';
</script>

<template>
  <FrameworkSandbox
    framework="vue"
    :code="code"
    title="TimeGuard · Locales e Idiomas"
  />
</template>
