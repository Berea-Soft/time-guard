<template>
  <div class="demo-wrapper vue-theme">
    <div class="clock-card">
      <div class="clock-header">
        <span class="brand-badge">Vue</span>
        <span class="live-badge">● LIVE</span>
        <span class="composable-badge">Composable</span>
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
      <button class="action-btn" @click="switchLocale">
        <span>🌐</span> {{ localeBtn }}
      </button>
    </div>

    <!-- Template directive demo -->
    <div
      class="directive-demo"
      v-time-guard:format="'now'"
      data-pattern="HH:mm:ss"
      data-live="true"
      data-interval="1000"
    >
      <!-- rendered by directive -->
    </div>

    <!-- API callout -->
    <div class="api-callout">
      <div class="api-header">
        🟢 Usando <code>@bereasoftware/time-guard/vue</code>
      </div>
      <div class="api-body">
        <div class="api-line">
          <span class="api-kw">import</span> { useCurrentTime, useRelativeTime,
          TimeGuardVuePlugin, vTimeGuard } <span class="api-kw">from</span>
          <span class="api-str">'@bereasoftware/time-guard/vue'</span>;
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
        <div class="api-line">
          <span class="api-comment"
            >// app.use(TimeGuardVuePlugin, { locale: 'es' })</span
          >
        </div>
        <div class="api-line">
          <span class="api-tag">&lt;span</span>
          <span class="api-attr">v-time-guard:format</span>=<span
            class="api-str"
            >"'now'"</span
          >
          <span class="api-attr">data-pattern</span>=<span class="api-str"
            >"HH:mm:ss"</span
          >
          <span class="api-attr">data-live</span>
          <span class="api-tag">/&gt;</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Real TimeGuard Vue composables — this demo genuinely runs
 * useCurrentTime/useRelativeTime from @bereasoftware/time-guard/vue
 * (no manual polling / setInterval of our own).
 */
import { ref, computed } from 'vue';
import { TimeGuard } from '@bereasoftware/time-guard';
import {
  useCurrentTime,
  useRelativeTime,
  vTimeGuard,
} from '@bereasoftware/time-guard/vue';
// vTimeGuard is already imported above — Vue SFC will pick up the directive

const locale = ref<'es' | 'en'>('es');
const localeBtn = computed(() => (locale.value === 'es' ? 'EN' : 'ES'));

// Ticking TimeGuard instance — updates every 100ms via the real composable.
const now = useCurrentTime({ interval: 100 });

const timeStr = computed(() =>
  now.value.locale(locale.value).format('HH:mm:ss.SSS'),
);
const dateStr = computed(() =>
  now.value.locale(locale.value).format('dddd, DD MMMM YYYY'),
);
const formats = computed(() => [
  { label: 'ISO', value: now.value.toISOString() },
  { label: 'RFC 2822', value: now.value.format('rfc2822') },
  { label: 'UTC', value: now.value.format('utc') },
]);

// Relative time against a fixed anchor point, via the real composable.
const pastDate = TimeGuard.now().subtract({ minute: 30 }).toDate();
const relativeStr = useRelativeTime(pastDate);

function switchLocale(): void {
  locale.value = locale.value === 'es' ? 'en' : 'es';
}
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
.vue-theme .clock-card {
  background: linear-gradient(135deg, #0f1a0f 0%, #1a2e1a 40%, #1d3b1d 100%);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(66, 184, 131, 0.2);
  box-shadow: 0 8px 32px rgba(66, 184, 131, 0.08);
  margin-bottom: 12px;
}
.vue-theme .clock-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}
.vue-theme .brand-badge {
  background: #42b883;
  color: #0f1a0f;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 3px 10px;
  border-radius: 20px;
}
.vue-theme .live-badge {
  font-size: 10px;
  font-weight: 600;
  color: #4ade80;
  animation: pulse 2s infinite;
}
.vue-theme .composable-badge {
  font-size: 9px;
  font-weight: 500;
  color: #42b883;
  background: rgba(66, 184, 131, 0.12);
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
.vue-theme .clock-body {
  text-align: center;
  padding: 8px 0 12px;
}
.vue-theme .time-display {
  font-size: 38px;
  font-weight: 700;
  color: #f8fafc;
  font-variant-numeric: tabular-nums;
  letter-spacing: 1px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}
.vue-theme .date-display {
  font-size: 14px;
  color: #94a3b8;
  font-weight: 500;
  margin-top: 4px;
  margin-bottom: 16px;
}
.vue-theme .format-preview {
  display: grid;
  gap: 6px;
  text-align: left;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 12px 16px;
}
.vue-theme .format-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.vue-theme .format-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #64748b;
  min-width: 60px;
}
.vue-theme .format-value {
  font-size: 11px;
  font-weight: 500;
  color: #42b883;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  word-break: break-all;
}
.vue-theme .actions-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.vue-theme .action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  background: rgba(66, 184, 131, 0.08);
  border: 1px solid rgba(66, 184, 131, 0.2);
  border-radius: 10px;
  color: #e2e8f0;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.vue-theme .action-btn:hover {
  background: rgba(66, 184, 131, 0.16);
  transform: translateY(-1px);
}
.vue-theme .action-btn:active {
  transform: translateY(0);
  scale: 0.98;
}
.vue-theme .directive-demo {
  margin-bottom: 12px;
  padding: 8px 16px;
  background: rgba(66, 184, 131, 0.05);
  border: 1px solid rgba(66, 184, 131, 0.15);
  border-radius: 8px;
  font-size: 13px;
  color: #42b883;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  text-align: center;
}
.vue-theme .api-callout {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(66, 184, 131, 0.15);
  border-radius: 10px;
  overflow: hidden;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 11px;
}
.vue-theme .api-header {
  background: rgba(66, 184, 131, 0.1);
  padding: 8px 12px;
  color: #42b883;
  font-weight: 600;
  border-bottom: 1px solid rgba(66, 184, 131, 0.1);
}
.vue-theme .api-header code {
  color: #e2e8f0;
  font-size: 10px;
  background: rgba(66, 184, 131, 0.15);
  padding: 1px 6px;
  border-radius: 4px;
}
.vue-theme .api-body {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.vue-theme .api-line {
  line-height: 1.6;
}
.vue-theme .api-kw {
  color: #ff79c6;
}
.vue-theme .api-str {
  color: #f1fa8c;
}
.vue-theme .api-fn {
  color: #50fa7b;
}
.vue-theme .api-num {
  color: #bd93f9;
}
.vue-theme .api-comment {
  color: #6272a4;
  font-style: italic;
}
.vue-theme .api-tag {
  color: #ff5555;
}
.vue-theme .api-attr {
  color: #8be9fd;
}
</style>
