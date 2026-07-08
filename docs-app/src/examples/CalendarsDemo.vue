<script lang="ts">
/**
 * Real, live-running alternative-calendars example — executes inside a
 * StackBlitz sandbox (see FrameworkSandbox.vue), same treatment as the
 * other framework demos. Source of truth lives in
 * ./_sources/CalendarsDemoSource.vue, read via Vite's `?raw` loader.
 */
import codeRaw from './_sources/CalendarsDemoSource.vue?raw';
export const code = codeRaw;
export const title = 'Calendarios Alternativos';
export const slug = 'calendars-demo';
</script>

<script setup lang="ts">
import FrameworkSandbox from '@/components/FrameworkSandbox.vue';
</script>

<template>
  <FrameworkSandbox
    framework="vue"
    :code="code"
    title="TimeGuard · Calendarios"
  />
</template>
