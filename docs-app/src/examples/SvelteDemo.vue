<script lang="ts">
/**
 * Real, live-running Svelte example — executes the actual
 * @bereasoftware/time-guard/svelte stores inside a StackBlitz sandbox (see
 * FrameworkSandbox.vue), not a Vue simulation.
 *
 * Exported as a plain named export (not inside <script setup>) so
 * DemoPage.vue's code panel can show this isolated snippet directly
 * instead of the whole wrapper file below.
 *
 * Built via concatenation so the literal open/close script-tag substrings
 * never appear contiguously in this file's source — the SFC block parser
 * scans for those tags as plain text and would otherwise mistake this
 * embedded Svelte snippet for a second script block.
 */
export const title = 'Svelte';
export const slug = 'svelte-demo';

const scriptOpen = '<' + 'script lang="ts">';
const scriptClose = '</' + 'script>';

export const code =
  scriptOpen +
  `
  import { useCurrentTime, useRelativeTime } from '@bereasoftware/time-guard/svelte';
  import { TimeGuard } from '@bereasoftware/time-guard';

  let locale: 'es' | 'en' = 'es';
  const now = useCurrentTime({ interval: 100 });
  const relative = useRelativeTime(TimeGuard.now().subtract({ minute: 30 }).toDate());

  function toggleLocale() {
    locale = locale === 'es' ? 'en' : 'es';
  }
` +
  scriptClose +
  `

<div style="font-family: monospace; min-height: 100vh; padding: 24px; color: #e2e8f0; background: #0f172a">
  <h1 style="color: #ff3e00; font-size: 18px; margin-bottom: 16px">
    TimeGuard · Svelte (useCurrentTime + useRelativeTime)
  </h1>
  <p style="font-size: 32px; font-weight: 700">{$now.locale(locale).format('HH:mm:ss.SSS')}</p>
  <p style="color: #94a3b8">{$now.locale(locale).format('dddd, DD MMMM YYYY')}</p>
  <p>Relativo: {$relative}</p>
  <button
    onclick={toggleLocale}
    style="margin-top: 12px; padding: 8px 16px; cursor: pointer; background: rgba(255,62,0,0.12); color: #e2e8f0; border: 1px solid #ff3e00; border-radius: 8px"
  >
    🌐 Cambiar a {locale === 'es' ? 'EN' : 'ES'}
  </button>
</div>
`;
</script>

<script setup lang="ts">
import FrameworkSandbox from '@/components/FrameworkSandbox.vue';
</script>

<template>
  <FrameworkSandbox
    framework="svelte"
    :code="code"
    title="TimeGuard · Svelte"
  />
</template>
