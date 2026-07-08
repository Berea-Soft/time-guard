<script setup lang="ts">
/**
 * Embeds a REAL, live-running StackBlitz project (WebContainers) for a
 * given framework, executing the actual
 * `@bereasoftware/time-guard/<framework>` wrapper — not a Vue simulation
 * of it. Runs the project entirely in the visitor's browser (no external
 * per-sandbox bundler service), so it works the same on localhost and in
 * production.
 */
import { ref, onMounted, onBeforeUnmount, computed, inject } from 'vue';
import {
  embedInStackBlitz,
  openInStackBlitz,
  FRAMEWORKS,
  type Framework,
  type PlaygroundMode,
} from '@/playground';
import { I18N_KEY, type I18nContext } from '@/i18n';

const { t } = inject(I18N_KEY) as I18nContext;

const props = withDefaults(
  defineProps<{
    framework: Framework;
    code: string;
    mode?: PlaygroundMode;
    title?: string;
    height?: number;
  }>(),
  {
    mode: 'app',
    height: 420,
  },
);

const meta = computed(() => FRAMEWORKS.find((f) => f.id === props.framework));

const containerRef = ref<HTMLDivElement | null>(null);
const status = ref<'loading' | 'ready' | 'error'>('loading');
// True once the embed has had a while to boot (npm install + dev server).
// We can't detect success inside the embedded WebContainer itself, so this
// is a time-based nudge toward the reliable "open in StackBlitz" fallback,
// not an error state.
const slowHint = ref(false);
let slowTimer: ReturnType<typeof setTimeout> | null = null;

onMounted(async () => {
  slowTimer = setTimeout(() => {
    slowHint.value = true;
  }, 12000);

  if (!containerRef.value) {
    return;
  }
  try {
    await embedInStackBlitz(
      containerRef.value,
      props.framework,
      props.mode,
      { code: props.code, title: props.title },
      { height: props.height },
    );
    status.value = 'ready';
  } catch {
    status.value = 'error';
  }
});

onBeforeUnmount(() => {
  if (containerRef.value) {
    containerRef.value.innerHTML = '';
  }
  if (slowTimer) {
    clearTimeout(slowTimer);
  }
});

function openSandbox(): void {
  openInStackBlitz(props.framework, props.mode, {
    code: props.code,
    title: props.title,
  });
}
</script>

<template>
  <div
    class="framework-sandbox"
    :style="{ '--fs-brand': meta?.color ?? '#64748b' }"
  >
    <div class="fs-header">
      <span class="fs-badge">{{ meta?.label ?? framework }}</span>
      <span class="fs-live">● LIVE</span>
      <button type="button" class="fs-open-btn" @click="openSandbox">
        {{ t('sandbox.open') }} ↗
      </button>
    </div>

    <div class="fs-frame" :style="{ minHeight: `${height}px` }">
      <div ref="containerRef" class="fs-container" />
      <div v-if="status === 'loading'" class="fs-overlay">
        {{ t('sandbox.loading') }}
      </div>
      <div v-else-if="status === 'error'" class="fs-overlay fs-overlay-error">
        {{ t('sandbox.error') }}
      </div>
    </div>

    <p v-if="slowHint" class="fs-slow-hint">
      {{ t('sandbox.slow_hint') }}
      <button type="button" class="fs-slow-hint-link" @click="openSandbox">
        {{ t('sandbox.open') }} ↗
      </button>
    </p>
  </div>
</template>

<style scoped>
.framework-sandbox {
  display: flex;
  flex-direction: column;
  font-family:
    ui-sans-serif,
    system-ui,
    -apple-system,
    sans-serif;
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 200px);
  max-width: 100%;
}
.fs-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-shrink: 0;
}
.fs-badge {
  background: var(--fs-brand);
  color: #0c0c1d;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 3px 10px;
  border-radius: 20px;
}
.fs-live {
  font-size: 10px;
  font-weight: 600;
  color: #4ade80;
  animation: fs-pulse 2s infinite;
}
@keyframes fs-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
.fs-open-btn {
  margin-left: auto;
  font-size: 11px;
  font-weight: 600;
  color: var(--fs-brand);
  background: color-mix(in srgb, var(--fs-brand) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--fs-brand) 35%, transparent);
  border-radius: 8px;
  padding: 4px 10px;
  cursor: pointer;
  transition: all 0.15s;
}
.fs-open-btn:hover {
  background: color-mix(in srgb, var(--fs-brand) 20%, transparent);
}
.fs-frame {
  position: relative;
  flex: 1 1 auto;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: #0f172a;
}
:deep(.fs-container) {
  width: 100% !important;
  min-height: calc(100vh - 200px);
}
/*
 * StackBlitz's SDK does NOT inject its iframe inside the element we give
 * it — it inserts the iframe as a SIBLING of .fs-container, both children
 * of .fs-frame (verified via devtools: the iframe's parentElement is
 * .fs-frame, leaving .fs-container empty). So target .fs-frame here, not
 * .fs-container, and !important to override the SDK's own inline width.
 */
:deep(.fs-frame) :deep(iframe) {
  width: 100% !important;
  height: 100% !important;
  border: 0;
  display: block;
}
.fs-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #94a3b8;
  background: rgba(15, 23, 42, 0.85);
  text-align: center;
  padding: 0 16px;
}
.fs-overlay-error {
  color: #fca5a5;
}
.fs-slow-hint {
  flex-shrink: 0;
  margin: 8px 0 0;
  font-size: 11px;
  color: #94a3b8;
  text-align: center;
}
.fs-slow-hint-link {
  color: var(--fs-brand);
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
}
</style>
