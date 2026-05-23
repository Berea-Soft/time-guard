<template>
  <div class="demo-wrapper react-theme">
    <div class="clock-card">
      <div class="clock-header">
        <span class="brand-badge">React</span>
        <span class="live-badge">● LIVE</span>
        <span class="hooks-badge">Hooks</span>
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
            <span class="format-label">Relativo</span>
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

    <!-- API callout -->
    <div v-pre class="api-callout">
      <div class="api-header">
        ⚛️ Usando <code>@bereasoftware/time-guard/react</code>
      </div>
      <div class="api-body">
        <div class="api-line">
          <span class="api-kw">import</span> { TimeGuardProvider,
          useCurrentTime, useRelativeTime } <span class="api-kw">from</span>
          <span class="api-str">'@bereasoftware/time-guard/react'</span>;
        </div>
        <div class="api-line">
          <span class="api-kw">const</span> now =
          <span class="api-fn">useCurrentTime</span>({ interval: 100, config: {
          locale: 'es' } });
        </div>
        <div class="api-line">
          <span class="api-kw">const</span> relative =
          <span class="api-fn">useRelativeTime</span>(now, { locale: 'es' });
        </div>
        <div class="api-line">
          <span class="api-kw">return</span>
          <span class="api-tag">&lt;TimeGuardProvider</span>
          config={{ locale: 'es' }}<span class="api-tag">&gt;</span> ...
          <span class="api-tag">&lt;/TimeGuardProvider&gt;</span>;
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
.react-theme .clock-card {
  background: linear-gradient(135deg, #0c0c1d 0%, #1a1a2e 40%, #20234a 100%);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(97, 218, 251, 0.2);
  box-shadow: 0 8px 32px rgba(97, 218, 251, 0.08);
  margin-bottom: 12px;
}
.react-theme .clock-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}
.react-theme .brand-badge {
  background: #61dafb;
  color: #0c0c1d;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 3px 10px;
  border-radius: 20px;
}
.react-theme .live-badge {
  font-size: 10px;
  font-weight: 600;
  color: #4ade80;
  animation: pulse 2s infinite;
}
.react-theme .hooks-badge {
  font-size: 9px;
  font-weight: 500;
  color: #61dafb;
  background: rgba(97, 218, 251, 0.12);
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
.react-theme .clock-body {
  text-align: center;
  padding: 8px 0 12px;
}
.react-theme .time-display {
  font-size: 38px;
  font-weight: 700;
  color: #f8fafc;
  font-variant-numeric: tabular-nums;
  letter-spacing: 1px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}
.react-theme .date-display {
  font-size: 14px;
  color: #94a3b8;
  font-weight: 500;
  margin-top: 4px;
  margin-bottom: 16px;
}
.react-theme .format-preview {
  display: grid;
  gap: 6px;
  text-align: left;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 12px 16px;
}
.react-theme .format-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.react-theme .format-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #64748b;
  min-width: 60px;
}
.react-theme .format-value {
  font-size: 11px;
  font-weight: 500;
  color: #61dafb;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  word-break: break-all;
}
.react-theme .actions-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.react-theme .action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  background: rgba(97, 218, 251, 0.08);
  border: 1px solid rgba(97, 218, 251, 0.2);
  border-radius: 10px;
  color: #e2e8f0;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.react-theme .action-btn:hover {
  background: rgba(97, 218, 251, 0.16);
  transform: translateY(-1px);
}
.react-theme .action-btn:active {
  transform: translateY(0);
  scale: 0.98;
}
.react-theme .api-callout {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(97, 218, 251, 0.15);
  border-radius: 10px;
  overflow: hidden;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 11px;
}
.react-theme .api-header {
  background: rgba(97, 218, 251, 0.1);
  padding: 8px 12px;
  color: #61dafb;
  font-weight: 600;
  border-bottom: 1px solid rgba(97, 218, 251, 0.1);
}
.react-theme .api-header code {
  color: #e2e8f0;
  font-size: 10px;
  background: rgba(97, 218, 251, 0.15);
  padding: 1px 6px;
  border-radius: 4px;
}
.react-theme .api-body {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.react-theme .api-line {
  line-height: 1.6;
}
.react-theme .api-kw {
  color: #ff79c6;
}
.react-theme .api-str {
  color: #f1fa8c;
}
.react-theme .api-fn {
  color: #50fa7b;
}
.react-theme .api-num {
  color: #bd93f9;
}
.react-theme .api-tag {
  color: #ff5555;
}
</style>
