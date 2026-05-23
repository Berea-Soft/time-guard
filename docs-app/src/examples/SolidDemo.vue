<template>
  <div class="demo-wrapper solid-theme">
    <div class="clock-card">
      <div class="clock-header">
        <span class="brand-badge">SolidJS</span>
        <span class="live-badge">● LIVE</span>
      </div>
      <div class="clock-body">
        <div class="time-display">{{ timeStr }}</div>
        <div class="date-display">{{ dateStr }}</div>
        <div class="tz-display">{{ tzStr }}</div>
      </div>
      <div class="clock-footer">
        <div class="stat">
          <span class="stat-label">Milisegundo</span>
          <span class="stat-value mono">{{ msStr }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Timestamp</span>
          <span class="stat-value mono">{{ tsStr }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">ISO</span>
          <span class="stat-value mono truncate">{{ isoStr }}</span>
        </div>
      </div>
    </div>

    <div class="metrics-grid">
      <div class="metric-card" v-for="m in metrics" :key="m.label">
        <div class="metric-icon">{{ m.icon }}</div>
        <div>
          <div class="metric-label">{{ m.label }}</div>
          <div class="metric-value">{{ m.value }}</div>
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

const timeStr = ref('');
const dateStr = ref('');
const tzStr = ref('');
const msStr = ref('');
const tsStr = ref('');
const isoStr = ref('');

const metrics = ref([
  { icon: '🗓️', label: 'Año', value: '' },
  { icon: '📊', label: 'Trimestre', value: '' },
  { icon: '📅', label: 'Día del año', value: '' },
  { icon: '🔄', label: 'Semana', value: '' },
]);

const update = () => {
  const n = now.value;
  timeStr.value = n.format('HH:mm:ss');
  dateStr.value = n.format('dddd, DD MMMM YYYY');
  tzStr.value = `UTC${n.getOffset()}`;
  msStr.value = String(n.millisecond()).padStart(3, '0');
  tsStr.value = String(n.unix());
  isoStr.value = n.toISOString();

  metrics.value = [
    { icon: '🗓️', label: 'Año', value: String(n.year()) },
    { icon: '📊', label: 'Trimestre', value: `Q${Math.ceil(n.month() / 3)}` },
    { icon: '📅', label: 'Día del año', value: String(n.dayOfYear()) },
    { icon: '🔄', label: 'Semana', value: `Semana ${n.weekOfYear()}` },
  ];
};

onMounted(() => {
  update();
  timer = window.setInterval(update, 50);
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
.solid-theme .clock-card {
  background: linear-gradient(135deg, #0a1628 0%, #1a2744 50%, #2c3e6b 100%);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(44, 79, 124, 0.3);
  box-shadow: 0 8px 32px rgba(44, 79, 124, 0.12);
  margin-bottom: 16px;
}
.solid-theme .clock-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.solid-theme .brand-badge {
  background: #2c4f7c;
  color: white;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 3px 10px;
  border-radius: 20px;
}
.solid-theme .live-badge {
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
.solid-theme .clock-body {
  text-align: center;
  padding: 8px 0 16px;
}
.solid-theme .time-display {
  font-size: 36px;
  font-weight: 700;
  color: #f8fafc;
  font-variant-numeric: tabular-nums;
  letter-spacing: 2px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}
.solid-theme .date-display {
  font-size: 14px;
  color: #94a3b8;
  font-weight: 500;
  margin-top: 4px;
}
.solid-theme .tz-display {
  font-size: 11px;
  color: #2c4f7c;
  margin-top: 4px;
  font-weight: 500;
}
.solid-theme .clock-footer {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}
.solid-theme .stat {
  text-align: center;
}
.solid-theme .stat-label {
  display: block;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #64748b;
  margin-bottom: 2px;
}
.solid-theme .stat-value.mono {
  font-size: 11px;
  font-weight: 600;
  color: #e2e8f0;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}
.solid-theme .stat-value.truncate {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}
.solid-theme .metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}
.solid-theme .metric-card {
  background: rgba(44, 79, 124, 0.06);
  border: 1px solid rgba(44, 79, 124, 0.15);
  border-radius: 12px;
  padding: 12px 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}
.solid-theme .metric-card:hover {
  background: rgba(44, 79, 124, 0.12);
  transform: translateY(-1px);
}
.solid-theme .metric-icon {
  font-size: 20px;
  line-height: 1;
}
.solid-theme .metric-label {
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #64748b;
}
.solid-theme .metric-value {
  font-size: 14px;
  font-weight: 700;
  color: #f1f5f9;
}
</style>
