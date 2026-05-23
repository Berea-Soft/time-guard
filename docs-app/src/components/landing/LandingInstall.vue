<script setup lang="ts">
import { ref, inject, onMounted } from 'vue';
import { Copy, Check, Package, Terminal } from '@lucide/vue';
import { I18N_KEY, type I18nContext } from '@/i18n';

const { t } = inject(I18N_KEY)! as I18nContext;

const installers = [
  {
    id: 'npm',
    label: 'npm',
    command: 'npm install @bereasoftware/time-guard',
    color: 'bg-brand-600',
    lightColor: 'bg-brand-50 dark:bg-brand-950/30',
    borderColor: 'border-brand-200 dark:border-brand-900',
  },
  {
    id: 'yarn',
    label: 'yarn',
    command: 'yarn add @bereasoftware/time-guard',
    color: 'bg-sky-600',
    lightColor: 'bg-sky-50 dark:bg-sky-950/30',
    borderColor: 'border-sky-200 dark:border-sky-900',
  },
  {
    id: 'pnpm',
    label: 'pnpm',
    command: 'pnpm add @bereasoftware/time-guard',
    color: 'bg-blue-600',
    lightColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-900',
  },
  {
    id: 'bun',
    label: 'bun',
    command: 'bun add @bereasoftware/time-guard',
    color: 'bg-indigo-600',
    lightColor: 'bg-indigo-50 dark:bg-indigo-950/30',
    borderColor: 'border-indigo-200 dark:border-indigo-900',
  },
  {
    id: 'cdn',
    label: 'CDN',
    command:
      '<script src="https://cdn.jsdelivr.net/npm/@bereasoftware/time-guard/dist/time-guard.umd.js"><\/script>',
    color: 'bg-brand-500',
    lightColor: 'bg-brand-50 dark:bg-brand-950/30',
    borderColor: 'border-brand-200 dark:border-brand-900',
  },
];

const copiedId = ref<string | null>(null);
const visible = ref(false);
const sectionRef = ref<HTMLElement | null>(null);

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        visible.value = true;
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.1 },
  );
  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }
});

async function copyInstaller(command: string, id: string) {
  try {
    await navigator.clipboard.writeText(command);
    copiedId.value = id;
    setTimeout(() => {
      if (copiedId.value === id) {
        copiedId.value = null;
      }
    }, 2000);
  } catch (e) {
    /* ignore */
  }
}
</script>

<template>
  <section
    ref="sectionRef"
    class="w-full py-16 sm:py-20 bg-slate-50/50 dark:bg-slate-900/30"
  >
    <div class="px-6 mx-auto max-w-7xl">
      <div class="flex items-center gap-3">
        <div
          class="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/40"
        >
          <Package class="w-5 h-5 text-brand-600 dark:text-brand-400" />
        </div>
        <div>
          <h2 class="text-2xl font-bold font-display">
            {{ t('install.title') }}
          </h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            {{ t('install.subtitle') }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div
          v-for="(installer, i) in installers"
          :key="installer.id"
          :class="[
            'group relative flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all duration-500',
            installer.lightColor,
            installer.borderColor,
            'hover:shadow-lg hover:-translate-y-1',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
          ]"
          :style="{ transitionDelay: visible ? `${i * 0.08}s` : '0s' }"
        >
          <div
            :class="[
              'w-8 h-8 rounded-lg flex items-center justify-center',
              installer.color,
            ]"
          >
            <Terminal class="w-4 h-4 text-white" />
          </div>
          <div class="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {{ installer.label }}
          </div>
          <pre
            class="w-full p-2.5 text-[11px] font-mono leading-relaxed rounded-lg bg-white/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 overflow-x-auto whitespace-pre-wrap"
            >{{ installer.command }}</pre
          >
          <button
            @click="copyInstaller(installer.command, installer.id)"
            :class="[
              'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 active:scale-95',
              copiedId === installer.id
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90',
            ]"
          >
            <Check v-if="copiedId === installer.id" class="w-3.5 h-3.5" />
            <Copy v-else class="w-3.5 h-3.5" />
            {{
              copiedId === installer.id
                ? t('install.copied')
                : t('install.copy')
            }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
