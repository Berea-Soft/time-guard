<script setup lang="ts">
import { ref, inject, onMounted } from 'vue';
import { Heart, ExternalLink, Sparkles } from '@lucide/vue';
import { I18N_KEY, type I18nContext } from '@/i18n';

const { t } = inject(I18N_KEY)! as I18nContext;

const sponsors = ref<{ login: string; avatar: string; url: string }[]>([]);

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
</script>

<template>
  <section
    ref="sectionRef"
    class="w-full py-16 sm:py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900/50"
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
          <Sparkles class="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
          <span
            class="text-xs font-semibold tracking-wide uppercase text-brand-700 dark:text-brand-300"
            >{{ t('sponsors.badge') }}</span
          >
        </div>

        <h2
          class="text-3xl font-bold font-display sm:text-4xl text-slate-900 dark:text-white"
        >
          {{ t('sponsors.title') }}
        </h2>
        <p
          class="max-w-xl mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400"
        >
          {{ t('sponsors.description') }}
        </p>

        <div class="flex flex-wrap items-center justify-center gap-4 mt-8">
          <a
            href="https://github.com/sponsors/Berea-Soft"
            target="_blank"
            class="group inline-flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 rounded-xl bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-500 hover:to-sky-500 shadow-lg shadow-brand-500/20 hover:shadow-xl hover:shadow-brand-500/30 hover:scale-105 active:scale-95"
          >
            <Heart class="w-4 h-4 transition-transform group-hover:scale-110" />
            {{ t('sponsors.github') }}
            <ExternalLink class="w-3.5 h-3.5 opacity-70" />
          </a>
          <a
            href="https://ko-fi.com/bereasoft"
            target="_blank"
            class="group inline-flex items-center gap-2 px-6 py-3 font-medium transition-all duration-300 border rounded-xl border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105 active:scale-95"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-.215 1.472-1.781 1.462-1.781 1.462H5.393L5.589 6h6.175c1.284 0 2.002.802 1.064 3.058.229.472.127 1.239-.009 3.401z"
              />
            </svg>
            {{ t('sponsors.kofi') }}
          </a>
          <a
            href="https://www.paypal.com/donate/?hosted_button_id=94LHL9ZBUGPWN"
            target="_blank"
            class="group inline-flex items-center gap-2 px-6 py-3 font-medium transition-all duration-300 border rounded-xl border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105 active:scale-95"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"
              />
            </svg>
            {{ t('sponsors.paypal') }}
          </a>
        </div>

        <div
          v-if="sponsors.length > 0"
          class="flex flex-wrap items-center justify-center gap-3 mt-10"
        >
          <a
            v-for="sponsor in sponsors"
            :key="sponsor.login"
            :href="sponsor.url"
            target="_blank"
            class="group relative"
            :title="sponsor.login"
          >
            <img
              :src="sponsor.avatar"
              :alt="sponsor.login"
              class="w-10 h-10 transition-all duration-300 border-2 border-transparent rounded-full hover:border-amber-400 hover:scale-110 hover:shadow-lg"
            />
          </a>
        </div>

        <p
          v-if="sponsors.length === 0"
          class="mt-8 text-xs text-slate-400 dark:text-slate-500"
        >
          {{ t('sponsors.empty') }}
        </p>
      </div>
    </div>
  </section>
</template>
