<script lang="ts">
/**
 * Real, live-running React example — executes the actual
 * @bereasoftware/time-guard/react hooks inside a StackBlitz sandbox (see
 * FrameworkSandbox.vue), not a Vue simulation.
 *
 * Exported as a plain named export (not inside <script setup>) so
 * DemoPage.vue's code panel can show this isolated snippet directly
 * instead of the whole wrapper file below.
 */
export const title = 'React';
export const slug = 'react-demo';

export const code = `import { useState } from 'react';
import { useCurrentTime, useRelativeTime } from '@bereasoftware/time-guard/react';
import { TimeGuard } from '@bereasoftware/time-guard';

// Fixed anchor point for the "relative time" example
const pastDate = TimeGuard.now().subtract({ minute: 30 }).toDate();

export default function App() {
  const [locale, setLocale] = useState('es');
  const now = useCurrentTime({ interval: 100 });
  const relative = useRelativeTime(pastDate);

  return (
    <div style={{
      fontFamily: 'monospace', minHeight: '100vh', padding: 24,
      color: '#e2e8f0', background: '#0f172a',
    }}>
      <h1 style={{ color: '#61dafb', fontSize: 18, marginBottom: 16 }}>
        TimeGuard · React (useCurrentTime + useRelativeTime)
      </h1>
      <p style={{ fontSize: 32, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
        {now.locale(locale).format('HH:mm:ss.SSS')}
      </p>
      <p style={{ color: '#94a3b8' }}>{now.locale(locale).format('dddd, DD MMMM YYYY')}</p>
      <p>Relativo: {relative}</p>
      <button
        onClick={() => setLocale((l) => (l === 'es' ? 'en' : 'es'))}
        style={{
          marginTop: 12, padding: '8px 16px', cursor: 'pointer',
          background: 'rgba(97,218,251,0.12)', color: '#e2e8f0',
          border: '1px solid #61dafb', borderRadius: 8,
        }}
      >
        🌐 Cambiar a {locale === 'es' ? 'EN' : 'ES'}
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
  <FrameworkSandbox framework="react" :code="code" title="TimeGuard · React" />
</template>
