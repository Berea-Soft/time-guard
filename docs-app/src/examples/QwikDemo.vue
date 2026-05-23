<template>
  <div class="demo-wrapper qwik-theme">
    <div class="clock-card">
      <div class="clock-header">
        <span class="brand-badge">Qwik</span>
        <span class="live-badge">● LIVE</span>
        <span class="resumable-badge">Resumable</span>
      </div>
      <div class="clock-body">
        <div class="time-display">{{ timeStr }}</div>
        <div class="date-display">{{ dateStr }}</div>
        <div class="format-preview">
          <div class="format-row" v-for="f in formats" :key="f.label">
            <span class="format-label">{{ f.label }}</span>
            <span class="format-value">{{ f.value }}</span>
          </div>
          <div class="format-row">
            <span class="format-label">Relative</span>
            <span class="format-value">{{ relativeStr }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="actions-row">
      <button class="action-btn" @click="refreshDate">
        <span>🔄</span> {{ timeStr }}
      </button>
      <button class="action-btn" @click="switchLocale">
        <span>🌐</span> {{ localeBtn }}
      </button>
    </div>

    <!-- Wrapper API call display -->
    <div class="api-callout">
      <div class="api-header">
        ⚡ Usando <code>@bereasoftware/time-guard/qwik</code>
      </div>
      <div class="api-body">
        <div class="api-line">
          <span class="api-kw">import</span> { useCurrentTime, useRelativeTime }
          <span class="api-kw">from</span>
          <span class="api-str">'@bereasoftware/time-guard/qwik'</span>;
        </div>
        <div class="api-line">
          <span class="api-kw">const</span> now =
          <span class="api-fn">useCurrentTime</span>({ interval:
          <span class="api-num">100</span>, config: { locale:
          <span class="api-str">'es'</span> } });
        </div>
        <div class="api-line">
          <span class="api-kw">const</span> relative =
          <span class="api-fn">useRelativeTime</span>(now.value, { locale:
          <span class="api-str">'es'</span> });
        </div>
        <div class="api-comment">
          // Signals reactivos con limpieza automática en useVisibleTask$
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * QwikDemo — Demostración del wrapper @bereasoftware/time-guard/qwik
 *
 * La API expuesta (useCurrentTime, useRelativeTime, useTimeGuard)
 * es idéntica a la de @bereasoftware/time-guard/qwik.
 * El panel "API callout" muestra el código exacto del wrapper.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { TimeGuard } from '@bereasoftware/time-guard';

const now = ref(TimeGuard.now({ locale: 'es' }));
let timer: number | null = null;

const timeStr = ref('');
const dateStr = ref('');
const relativeStr = ref('');
const localeBtn = ref('EN');
let currentLocale: 'es' | 'en' = 'es';

const formats = ref([
  { label: 'ISO', value: '' },
  { label: 'RFC 2822', value: '' },
  { label: 'UTC', value: '' },
]);

const update = () => {
  const n = now.value;
  timeStr.value = n.format('HH:mm:ss.SSS');
  dateStr.value = n.format('dddd, DD MMMM YYYY');
  formats.value = [
    { label: 'ISO', value: n.toISOString() },
    { label: 'RFC 2822', value: n.format('rfc2822') },
    { label: 'UTC', value: n.format('utc') },
  ];
  // Relative time: 30 minutes ago from now
  const past = TimeGuard.now().subtract({ minute: 30 });
  relativeStr.value = past
    .since(TimeGuard.now())
    .humanize({ locale: currentLocale });
};

const refreshDate = () => {
  update();
};

const switchLocale = () => {
  currentLocale = currentLocale === 'es' ? 'en' : 'es';
  localeBtn.value = currentLocale === 'es' ? 'EN' : 'ES';
  now.value = TimeGuard.now({ locale: currentLocale });
  update();
};

onMounted(() => {
  update();
  timer = window.setInterval(() => {
    now.value = TimeGuard.now({ locale: currentLocale });
    update();
  }, 100);
});

onBeforeUnmount(() => {
  if (timer) {
    window.clearInterval(timer);
  }
});
</script>

<style scoped>
.demo-wrapper {
  font-family:
    ui-sans-serif,
    system-ui,
    -apple-system,
    sans-serif;
  max-width: 100%;
}
.qwik-theme .clock-card {
  background: linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 40%, #2d1b4e 100%);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(172, 126, 244, 0.2);
  box-shadow: 0 8px 32px rgba(172, 126, 244, 0.08);
  margin-bottom: 12px;
}
.qwik-theme .clock-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}
.qwik-theme .brand-badge {
  background: #ac7ef4;
  color: white;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 3px 10px;
  border-radius: 20px;
}
.qwik-theme .live-badge {
  font-size: 10px;
  font-weight: 600;
  color: #4ade80;
  animation: pulse 2s infinite;
}
.qwik-theme .resumable-badge {
  font-size: 9px;
  font-weight: 500;
  color: #ac7ef4;
  background: rgba(172, 126, 244, 0.12);
  padding: 2px 8px;
  border-radius: 10px;
  margin-left: auto;
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
.qwik-theme .clock-body {
  text-align: center;
  padding: 8px 0 12px;
}
.qwik-theme .time-display {
  font-size: 38px;
  font-weight: 700;
  color: #f8fafc;
  font-variant-numeric: tabular-nums;
  letter-spacing: 1px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}
.qwik-theme .date-display {
  font-size: 14px;
  color: #94a3b8;
  font-weight: 500;
  margin-top: 4px;
  margin-bottom: 16px;
}
.qwik-theme .format-preview {
  display: grid;
  gap: 6px;
  text-align: left;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 12px 16px;
}
.qwik-theme .format-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.qwik-theme .format-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #64748b;
  min-width: 60px;
}
.qwik-theme .format-value {
  font-size: 11px;
  font-weight: 500;
  color: #ac7ef4;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  word-break: break-all;
}
.qwik-theme .actions-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.qwik-theme .action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  background: rgba(172, 126, 244, 0.08);
  border: 1px solid rgba(172, 126, 244, 0.2);
  border-radius: 10px;
  color: #e2e8f0;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.qwik-theme .action-btn:hover {
  background: rgba(172, 126, 244, 0.16);
  transform: translateY(-1px);
}
.qwik-theme .action-btn:active {
  transform: translateY(0);
  scale: 0.98;
}
.qwik-theme .api-callout {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(172, 126, 244, 0.15);
  border-radius: 10px;
  overflow: hidden;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 11px;
}
.qwik-theme .api-header {
  background: rgba(172, 126, 244, 0.1);
  padding: 8px 12px;
  color: #ac7ef4;
  font-weight: 600;
  border-bottom: 1px solid rgba(172, 126, 244, 0.1);
}
.qwik-theme .api-header code {
  color: #e2e8f0;
  font-size: 10px;
  background: rgba(172, 126, 244, 0.15);
  padding: 1px 6px;
  border-radius: 4px;
}
.qwik-theme .api-body {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.qwik-theme .api-line {
  line-height: 1.6;
}
.qwik-theme .api-kw {
  color: #ff79c6;
}
.qwik-theme .api-str {
  color: #f1fa8c;
}
.qwik-theme .api-fn {
  color: #50fa7b;
}
.qwik-theme .api-num {
  color: #bd93f9;
}
.qwik-theme .api-comment {
  color: #6272a4;
  font-style: italic;
}
</style>
