<template>
  <div class="demo-wrapper angular-theme">
    <div class="clock-card">
      <div class="clock-header">
        <span class="brand-badge">Angular</span>
        <span class="live-badge">● LIVE</span>
        <span class="pipe-badge">Pipes</span>
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
      <button class="action-btn" @click="refreshDate"><span>🔄</span> {{ timeStr }}</button>
      <button class="action-btn" @click="switchLocale"><span>🌐</span> {{ localeBtn }}</button>
    </div>

    <!-- API callout -->
    <div v-pre class="api-callout">
      <div class="api-header">🅰️ Usando @bereasoftware/time-guard/angular</div>
      <div class="api-body">
        <div class="api-line">
          <span class="api-kw">import</span> { TimeGuardFormatPipe, TimeGuardRelativePipe,
          TimeGuardService, TIME_GUARD_CONFIG }
          <span class="api-kw">from</span>
          <span class="api-str">'@bereasoftware/time-guard/angular'</span>;
        </div>
        <div class="api-line">
          <span class="api-comment">// Template:</span>
        </div>
        <div class="api-line">
          <span class="api-tag">&lt;p&gt;</span
          >{{ now | timeGuardFormat:'HH:mm:ss.SSS'





          }}<span class="api-tag">&lt;/p&gt;</span>
        </div>
        <div class="api-line">
          <span class="api-tag">&lt;p&gt;</span
          >{{ date | timeGuardRelative:'es'





          }}<span class="api-tag">&lt;/p&gt;</span>
        </div>
        <div class="api-line">
          <span class="api-comment">// Servicio reactivo:</span>
        </div>
        <div class="api-line">
          <span class="api-kw">const</span> time$ = service.<span class="api-fn"
            >getCurrentTime</span
          >(<span class="api-num">100</span>);
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
  relativeStr.value = past.since(TimeGuard.now()).humanize({ locale: currentLocale });
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
.angular-theme .clock-card {
  background: linear-gradient(135deg, #1a0a0a 0%, #2e1212 40%, #3d1515 100%);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(221, 59, 59, 0.2);
  box-shadow: 0 8px 32px rgba(221, 59, 59, 0.08);
  margin-bottom: 12px;
}
.angular-theme .clock-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}
.angular-theme .brand-badge {
  background: #dd3b3b;
  color: #1a0a0a;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 3px 10px;
  border-radius: 20px;
}
.angular-theme .live-badge {
  font-size: 10px;
  font-weight: 600;
  color: #4ade80;
  animation: pulse 2s infinite;
}
.angular-theme .pipe-badge {
  font-size: 9px;
  font-weight: 500;
  color: #dd3b3b;
  background: rgba(221, 59, 59, 0.12);
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
.angular-theme .clock-body {
  text-align: center;
  padding: 8px 0 12px;
}
.angular-theme .time-display {
  font-size: 38px;
  font-weight: 700;
  color: #f8fafc;
  font-variant-numeric: tabular-nums;
  letter-spacing: 1px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}
.angular-theme .date-display {
  font-size: 14px;
  color: #94a3b8;
  font-weight: 500;
  margin-top: 4px;
  margin-bottom: 16px;
}
.angular-theme .format-preview {
  display: grid;
  gap: 6px;
  text-align: left;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 12px 16px;
}
.angular-theme .format-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.angular-theme .format-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #64748b;
  min-width: 60px;
}
.angular-theme .format-value {
  font-size: 11px;
  font-weight: 500;
  color: #dd3b3b;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  word-break: break-all;
}
.angular-theme .actions-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.angular-theme .action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  background: rgba(221, 59, 59, 0.08);
  border: 1px solid rgba(221, 59, 59, 0.2);
  border-radius: 10px;
  color: #e2e8f0;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.angular-theme .action-btn:hover {
  background: rgba(221, 59, 59, 0.16);
  transform: translateY(-1px);
}
.angular-theme .action-btn:active {
  transform: translateY(0);
  scale: 0.98;
}
.angular-theme .api-callout {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(221, 59, 59, 0.15);
  border-radius: 10px;
  overflow: hidden;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 11px;
}
.angular-theme .api-header {
  background: rgba(221, 59, 59, 0.1);
  padding: 8px 12px;
  color: #dd3b3b;
  font-weight: 600;
  border-bottom: 1px solid rgba(221, 59, 59, 0.1);
}
.angular-theme .api-header code {
  color: #e2e8f0;
  font-size: 10px;
  background: rgba(221, 59, 59, 0.15);
  padding: 1px 6px;
  border-radius: 4px;
}
.angular-theme .api-body {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.angular-theme .api-line {
  line-height: 1.6;
}
.angular-theme .api-kw {
  color: #ff79c6;
}
.angular-theme .api-str {
  color: #f1fa8c;
}
.angular-theme .api-fn {
  color: #50fa7b;
}
.angular-theme .api-num {
  color: #bd93f9;
}
.angular-theme .api-comment {
  color: #6272a4;
  font-style: italic;
}
.angular-theme .api-tag {
  color: #ff5555;
}
</style>
