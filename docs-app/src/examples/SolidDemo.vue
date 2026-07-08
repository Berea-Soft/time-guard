<script lang="ts">
/**
 * Real, live-running SolidJS example — executes the actual
 * @bereasoftware/time-guard/solid signals inside a StackBlitz sandbox (see
 * FrameworkSandbox.vue), not a Vue simulation.
 *
 * Exported as a plain named export (not inside <script setup>) so
 * DemoPage.vue's code panel can show this isolated snippet directly
 * instead of the whole wrapper file below.
 */
export const title = 'Solid';
export const slug = 'solid-demo';

export const code = `import { createSignal } from 'solid-js';
import { useCurrentTime, useRelativeTime } from '@bereasoftware/time-guard/solid';
import { TimeGuard } from '@bereasoftware/time-guard';

// Fixed anchor point for the "relative time" example
const pastDate = TimeGuard.now().subtract({ minute: 30 }).toDate();

export default function App() {
  const [locale, setLocale] = createSignal('es');
  const now = useCurrentTime({ interval: 100 });
  const relative = useRelativeTime(pastDate);

  return (
    <div style={{
      'font-family': 'monospace', 'min-height': '100vh', padding: '24px',
      color: '#e2e8f0', background: '#0f172a',
    }}>
      <h1 style={{ color: '#2c4f7c', 'font-size': '18px', 'margin-bottom': '16px' }}>
        TimeGuard · Solid (useCurrentTime + useRelativeTime)
      </h1>
      <p style={{ 'font-size': '32px', 'font-weight': 700 }}>
        {now().locale(locale()).format('HH:mm:ss.SSS')}
      </p>
      <p style={{ color: '#94a3b8' }}>{now().locale(locale()).format('dddd, DD MMMM YYYY')}</p>
      <p>Relativo: {relative()}</p>
      <button
        onClick={() => setLocale(locale() === 'es' ? 'en' : 'es')}
        style={{
          'margin-top': '12px', padding: '8px 16px', cursor: 'pointer',
          background: 'rgba(44,79,124,0.25)', color: '#e2e8f0',
          border: '1px solid #2c4f7c', 'border-radius': '8px',
        }}
      >
        🌐 Cambiar a {locale() === 'es' ? 'EN' : 'ES'}
      </button>
    </div>
  );
}
`;
</script>

<script setup lang="ts">
import FrameworkSandbox from '@/components/FrameworkSandbox.vue';
</script>

<template>
  <FrameworkSandbox framework="solid" :code="code" title="TimeGuard · Solid" />
</template>
