<template>
  <div class="demo-wrapper svelte-theme">
    <!-- Live Clock Card -->
    <div class="clock-card">
      <div class="clock-header">
        <span class="brand-badge">Svelte</span>
        <span class="live-badge">● LIVE</span>
      </div>
      <div class="clock-body">
        <div class="date-display">{{ dateStr }}</div>
        <div class="time-display">{{ timeStr }}</div>
        <div class="relative-display">{{ relativeStr }}</div>
      </div>
      <div class="clock-footer">
        <div class="stat">
          <span class="stat-label">Locale</span>
          <span class="stat-value">{{ localeStr }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Week</span>
          <span class="stat-value">{{ weekStr }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Day of Year</span>
          <span class="stat-value">{{ doyStr }}</span>
        </div>
      </div>
    </div>

    <!-- Features Grid -->
    <div class="features-grid">
      <div class="feature-card" v-for="f in features" :key="f.label">
        <div class="feature-icon" v-html="f.icon"></div>
        <div class="feature-content">
          <div class="feature-label">{{ f.label }}</div>
          <div class="feature-value">{{ f.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { TimeGuard } from '@bereasoftware/time-guard';

const now = ref(TimeGuard.now().locale('es'));
let timer: number | null = null;

const dateStr = ref('');
const timeStr = ref('');
const relativeStr = ref('');
const localeStr = ref('es');
const weekStr = ref('');
const doyStr = ref('');

const features = ref([
  { label: 'Año', icon: '📅', value: '' },
  { label: 'Mes', icon: '📆', value: '' },
  { label: 'Día', icon: '☀️', value: '' },
  { label: 'Hora', icon: '🕐', value: '' },
]);

const update = () => {
  const n = now.value;
  dateStr.value = n.format('dddd, DD MMMM YYYY');
  timeStr.value = n.format('HH:mm:ss.SSS');
  relativeStr.value =
    `hace ` + n.since(TimeGuard.now()).humanize({ locale: 'es' });
  weekStr.value = `Semana ${n.weekOfYear()}`;
  doyStr.value = `Día ${n.dayOfYear()}`;
  features.value = [
    { label: 'Año', icon: '📅', value: String(n.year()) },
    { label: 'Mes', icon: '📆', value: String(n.month()) },
    { label: 'Día', icon: '☀️', value: String(n.day()) },
    { label: 'Hora', icon: '🕐', value: String(n.hour()).padStart(2, '0') },
  ];
};

onMounted(() => {
  update();
  timer = window.setInterval(() => {
    now.value = TimeGuard.now().locale('es');
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
.svelte-theme .clock-card {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 62, 0, 0.2);
  box-shadow: 0 8px 32px rgba(255, 62, 0, 0.08);
  margin-bottom: 16px;
}
.svelte-theme .clock-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.svelte-theme .brand-badge {
  background: #ff3e00;
  color: white;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 3px 10px;
  border-radius: 20px;
}
.svelte-theme .live-badge {
  font-size: 10px;
  font-weight: 600;
  color: #4ade80;
  animation: pulse 2s infinite;
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
.svelte-theme .clock-body {
  text-align: center;
  padding: 8px 0 16px;
}
.svelte-theme .date-display {
  font-size: 14px;
  color: #94a3b8;
  font-weight: 500;
  margin-bottom: 4px;
}
.svelte-theme .time-display {
  font-size: 32px;
  font-weight: 700;
  color: #f8fafc;
  font-variant-numeric: tabular-nums;
  letter-spacing: 1px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}
.svelte-theme .relative-display {
  font-size: 12px;
  color: #ff3e00;
  margin-top: 6px;
  opacity: 0.8;
}
.svelte-theme .clock-footer {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}
.svelte-theme .stat {
  text-align: center;
}
.svelte-theme .stat-label {
  display: block;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #64748b;
  margin-bottom: 2px;
}
.svelte-theme .stat-value {
  font-size: 11px;
  font-weight: 600;
  color: #e2e8f0;
}
.svelte-theme .features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}
.svelte-theme .feature-card {
  background: rgba(255, 62, 0, 0.05);
  border: 1px solid rgba(255, 62, 0, 0.12);
  border-radius: 12px;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
  transition: all 0.2s;
}
.svelte-theme .feature-card:hover {
  background: rgba(255, 62, 0, 0.1);
  transform: translateY(-1px);
}
.svelte-theme .feature-icon {
  font-size: 18px;
  line-height: 1;
}
.svelte-theme .feature-label {
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #64748b;
}
.svelte-theme .feature-value {
  font-size: 16px;
  font-weight: 700;
  color: #f1f5f9;
  font-variant-numeric: tabular-nums;
}
</style>
