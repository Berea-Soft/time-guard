<script setup lang="ts">
import { ref, inject, onMounted } from 'vue';
import { Users, ExternalLink, GitCommit } from '@lucide/vue';
import { I18N_KEY, type I18nContext } from '@/i18n';

const { t } = inject(I18N_KEY)! as I18nContext;

interface Contributor {
  login: string;
  avatar: string;
  url: string;
  contributions: number;
}

const contributors = ref<Contributor[]>([]);
const loading = ref(true);
const error = ref(false);
const visible = ref(false);
const sectionRef = ref<HTMLElement | null>(null);

onMounted(async () => {
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
  try {
    const res = await fetch(
      'https://api.github.com/repos/Berea-Soft/time-guard/contributors?per_page=30',
    );
    if (res.ok) {
      const data: {
        login: string;
        avatar_url: string;
        html_url: string;
        contributions: number;
      }[] = await res.json();
      contributors.value = data.map((c) => ({
        login: c.login,
        avatar: c.avatar_url,
        url: c.html_url,
        contributions: c.contributions,
      }));
    } else {
      error.value = true;
    }
  } catch {
    error.value = true;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section
    ref="sectionRef"
    class="w-full py-16 sm:py-20 bg-white dark:bg-slate-950 border-y border-slate-100 dark:border-slate-800/60"
  >
    <div class="px-6 mx-auto max-w-7xl">
      <div
        class="flex flex-col items-center text-center transition-all duration-700"
        :class="
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        "
      >
        <div
          class="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-brand-100 dark:bg-brand-900/30"
        >
          <Users class="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          <span
            class="text-xs font-semibold tracking-wide uppercase text-brand-700 dark:text-brand-300"
            >{{ t('contributors.badge') }}</span
          >
        </div>

        <h2
          class="text-3xl font-bold font-display sm:text-4xl text-slate-900 dark:text-white"
        >
          {{ t('contributors.title') }}
        </h2>
        <p
          class="max-w-xl mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400"
        >
          {{ t('contributors.description') }}
        </p>

        <div v-if="loading" class="flex flex-wrap justify-center gap-4 mt-10">
          <div
            v-for="i in 12"
            :key="i"
            class="flex flex-col items-center gap-2 animate-pulse"
          >
            <div
              class="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-800"
            ></div>
            <div class="w-16 h-3 rounded bg-slate-200 dark:bg-slate-800"></div>
          </div>
        </div>

        <div
          v-else-if="!error && contributors.length > 0"
          class="flex flex-wrap justify-center gap-5 mt-10"
        >
          <a
            v-for="contributor in contributors"
            :key="contributor.login"
            :href="contributor.url"
            target="_blank"
            class="group flex flex-col items-center gap-2 p-3 transition-all duration-300 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:-translate-y-1"
          >
            <div class="relative">
              <img
                :src="contributor.avatar"
                :alt="contributor.login"
                class="w-14 h-14 transition-all duration-300 border-2 border-transparent rounded-full group-hover:border-brand-400 group-hover:shadow-lg group-hover:shadow-brand-500/10"
              />
              <div
                class="absolute -bottom-1 -right-1 flex items-center justify-center w-5 h-5 text-[9px] font-bold text-white rounded-full bg-brand-500 border-2 border-white dark:border-slate-950"
              >
                {{
                  contributor.contributions > 99
                    ? '99+'
                    : contributor.contributions
                }}
              </div>
            </div>
            <span
              class="text-xs font-medium text-slate-600 dark:text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors"
              >{{ contributor.login }}</span
            >
          </a>
        </div>

        <div v-else-if="error" class="mt-10 text-sm text-slate-400">
          {{ t('contributors.error') }}
          <a
            href="https://github.com/Berea-Soft/time-guard/graphs/contributors"
            target="_blank"
            class="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline"
          >
            {{ t('contributors.view_on_github') }}
            <ExternalLink class="w-3 h-3" />
          </a>
        </div>

        <a
          href="https://github.com/Berea-Soft/time-guard/blob/main/CONTRIBUTING.md"
          target="_blank"
          class="inline-flex items-center gap-2 px-5 py-2.5 mt-10 text-sm font-medium transition-all duration-300 border rounded-xl border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105 active:scale-95"
        >
          <GitCommit class="w-4 h-4" />
          {{ t('contributors.cta') }}
          <ExternalLink class="w-3.5 h-3.5 opacity-70" />
        </a>
      </div>
    </div>
  </section>
</template>
