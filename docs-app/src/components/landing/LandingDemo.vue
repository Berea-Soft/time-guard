<script setup lang="ts">
import { ref, computed, inject, onMounted, onBeforeUnmount } from 'vue';
import { TimeGuard } from '@bereasoftware/time-guard';
import { Play, Code2, Clock, Check, Copy, Sparkles } from '@lucide/vue';
import { I18N_KEY, type I18nContext } from '@/i18n';

const { t } = inject(I18N_KEY)! as I18nContext;

const snippets = [
  {
    titleKey: 'demo.snippet_format',
    code: `TimeGuard.now()\n  .locale('es')\n  .format('dddd, DD MMMM YYYY')`,
    output: (): string =>
      TimeGuard.now().locale('es').format('dddd, DD MMMM YYYY'),
  },
  {
    titleKey: 'demo.snippet_calc',
    code: `TimeGuard.from('2026-05-20')\n  .add({ day: 7 })\n  .subtract({ month: 1 })\n  .format('YYYY-MM-DD')`,
    output: (): string =>
      TimeGuard.from('2026-05-20')
        .add({ day: 7 })
        .subtract({ month: 1 })
        .format('YYYY-MM-DD'),
  },
  {
    titleKey: 'demo.snippet_diff',
    code: `const start = TimeGuard.from('2026-05-20');\nconst end = TimeGuard.from('2026-06-15');\nend.diff(start, 'day') + ' días'`,
    output: (): string => {
      const start = TimeGuard.from('2026-05-20');
      const end = TimeGuard.from('2026-06-15');
      return String(end.diff(start, 'day')) + ' ' + t('demo.days');
    },
  },
];

const activeSnippet = ref(0);
const copiedIndex = ref<number | null>(null);
const tick = ref(0);
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
    { threshold: 0.15 },
  );
  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }
});

const outputs = computed(() => {
  void tick.value;
  return snippets.map((s) => ({ ...s, result: s.output() }));
});

let tickTimer: ReturnType<typeof setInterval>;
onMounted(() => {
  tickTimer = setInterval(() => {
    tick.value++;
  }, 5000);
});
onBeforeUnmount(() => clearInterval(tickTimer));

function selectSnippet(index: number) {
  activeSnippet.value = index;
}
function copyCode(code: string, index: number) {
  navigator.clipboard.writeText(code);
  copiedIndex.value = index;
  setTimeout(() => {
    if (copiedIndex.value === index) {
      copiedIndex.value = null;
    }
  }, 2000);
}
</script>

<template>
  <section
    ref="sectionRef"
    class="w-full py-16 bg-white sm:py-20 dark:bg-slate-950"
  >
    <div class="px-6 mx-auto max-w-7xl">
      <div class="flex items-center gap-3">
        <div
          class="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/40"
        >
          <Play class="w-5 h-5 text-brand-600 dark:text-brand-400" />
        </div>
        <div>
          <h2 class="text-2xl font-bold font-display">{{ t('demo.title') }}</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            {{ t('demo.subtitle') }}
          </p>
        </div>
      </div>

      <div
        class="overflow-hidden border rounded-2xl bg-white/40 dark:bg-slate-900/30 border-slate-200/60 dark:border-slate-800/60 transition-all duration-700"
        :class="
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        "
      >
        <div
          class="flex overflow-x-auto border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/40"
        >
          <button
            v-for="(snippet, index) in snippets"
            :key="index"
            @click="selectSnippet(index)"
            :class="[
              'relative shrink-0 px-5 py-3 text-xs font-medium transition-all duration-200',
              activeSnippet === index
                ? 'text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-900'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-900/50',
            ]"
          >
            {{ t(snippet.titleKey) }}
            <div
              v-if="activeSnippet === index"
              class="absolute bottom-0 left-2 right-2 h-0.5 bg-brand-500 rounded-full"
            ></div>
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2">
          <div
            class="relative border-r border-slate-200/60 dark:border-slate-800/60"
          >
            <div
              class="flex items-center justify-between px-4 py-2 bg-slate-50/80 dark:bg-slate-950/60"
            >
              <div class="flex items-center gap-2">
                <Code2 class="w-3.5 h-3.5 text-slate-400" />
                <span
                  class="text-[10px] font-medium text-slate-400 uppercase tracking-wider"
                  >{{ t('demo.label_code') }}</span
                >
              </div>
              <button
                @click="copyCode(snippets[activeSnippet].code, activeSnippet)"
                class="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium transition-all rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              >
                <Check
                  v-if="copiedIndex === activeSnippet"
                  class="w-3 h-3 text-emerald-500"
                />
                <Copy v-else class="w-3 h-3" />
                {{
                  copiedIndex === activeSnippet
                    ? t('demo.copied')
                    : t('demo.copy')
                }}
              </button>
            </div>
            <pre
              class="p-4 overflow-x-auto font-mono text-xs leading-relaxed bg-white text-slate-800 dark:text-slate-200 dark:bg-slate-950"
            ><code>{{ snippets[activeSnippet].code }}</code></pre>
          </div>

          <div class="flex flex-col">
            <div
              class="flex items-center gap-2 px-4 py-2 bg-slate-50/80 dark:bg-slate-950/60"
            >
              <Clock class="w-3.5 h-3.5 text-emerald-500" />
              <span
                class="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider"
                >{{ t('demo.live_result') }}</span
              >
              <span
                class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
              ></span>
            </div>
            <div
              class="flex items-center justify-center flex-1 p-6 bg-linear-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900"
            >
              <div class="text-center">
                <div
                  class="inline-flex items-center gap-2 px-3 py-1.5 mb-3 rounded-full bg-brand-100 dark:bg-brand-900/30"
                >
                  <Sparkles
                    class="w-3 h-3 text-brand-600 dark:text-brand-400"
                  />
                  <span
                    class="text-[10px] font-medium text-brand-600 dark:text-brand-400 uppercase tracking-wider"
                    >{{ t('demo.label_output') }}</span
                  >
                </div>
                <div
                  class="text-lg font-semibold font-display text-slate-800 dark:text-slate-100"
                >
                  {{ outputs[activeSnippet].result }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
