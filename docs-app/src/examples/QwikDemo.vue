<script lang="ts">
/**
 * Real, live-running Qwik example — executes the actual
 * @bereasoftware/time-guard/qwik signals inside a StackBlitz sandbox (see
 * FrameworkSandbox.vue), not a Vue simulation.
 *
 * Exported as a plain named export (not inside <script setup>) so
 * DemoPage.vue's code panel can show this isolated snippet directly
 * instead of the whole wrapper file below.
 */
export const title = 'Qwik';
export const slug = 'qwik-demo';

export const code = `import { component$, useSignal } from '@builder.io/qwik';
import { useCurrentTime, useRelativeTime } from '@bereasoftware/time-guard/qwik';
import { TimeGuard } from '@bereasoftware/time-guard';

// Fixed anchor point for the "relative time" example
const pastDate = TimeGuard.now().subtract({ minute: 30 }).toDate();

export default component$(() => {
  const locale = useSignal('es');
  const now = useCurrentTime({ interval: 100 });
  const relative = useRelativeTime(pastDate);

  return (
    <div style="font-family: monospace; min-height: 100vh; padding: 24px; color: #e2e8f0; background: #0f172a">
      <h1 style="color: #ac7ef4; font-size: 18px; margin-bottom: 16px">
        TimeGuard · Qwik (useCurrentTime + useRelativeTime)
      </h1>
      <p style="font-size: 32px; font-weight: 700">
        {now.value.locale(locale.value).format('HH:mm:ss.SSS')}
      </p>
      <p style="color: #94a3b8">{now.value.locale(locale.value).format('dddd, DD MMMM YYYY')}</p>
      <p>Relativo: {relative.value}</p>
      <button
        onClick$={() => (locale.value = locale.value === 'es' ? 'en' : 'es')}
        style="margin-top: 12px; padding: 8px 16px; cursor: pointer; background: rgba(172,126,244,0.15); color: #e2e8f0; border: 1px solid #ac7ef4; border-radius: 8px"
      >
        🌐 Cambiar a {locale.value === 'es' ? 'EN' : 'ES'}
      </button>
    </div>
  );
});
`;
</script>

<script setup lang="ts">
import FrameworkSandbox from '@/components/FrameworkSandbox.vue';
</script>

<template>
  <FrameworkSandbox framework="qwik" :code="code" title="TimeGuard · Qwik" />
</template>
