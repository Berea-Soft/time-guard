<script setup lang="ts">
import { ref, inject, onMounted } from 'vue';
import {
  Clock,
  Globe,
  Puzzle,
  Zap,
  Shield,
  Palette,
  Layers,
  GitBranch,
  type LucideIcon,
} from '@lucide/vue';
import { I18N_KEY, type I18nContext } from '@/i18n';

const { t } = inject(I18N_KEY)! as I18nContext;

const visibleCards = ref<Set<number>>(new Set());
const cardRefs = ref<(HTMLElement | null)[]>([]);

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const idx = Number(entry.target.getAttribute('data-index'));
          if (!isNaN(idx)) {
            visibleCards.value = new Set([...visibleCards.value, idx]);
          }
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15 },
  );

  for (const el of cardRefs.value) {
    if (el) {
      observer.observe(el);
    }
  }
});

interface Feature {
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
}

const features: Feature[] = [
  {
    icon: Clock,
    titleKey: 'features.precision',
    descKey: 'features.precision_desc',
    gradient: 'from-brand-500 to-sky-600',
    iconBg: 'bg-brand-100 dark:bg-brand-900/30',
    iconColor: 'text-brand-600 dark:text-brand-400',
  },
  {
    icon: Globe,
    titleKey: 'features.multilocale',
    descKey: 'features.multilocale_desc',
    gradient: 'from-sky-500 to-cyan-600',
    iconBg: 'bg-sky-100 dark:bg-sky-900/30',
    iconColor: 'text-sky-600 dark:text-sky-400',
  },
  {
    icon: Puzzle,
    titleKey: 'features.plugins',
    descKey: 'features.plugins_desc',
    gradient: 'from-brand-500 to-indigo-600',
    iconBg: 'bg-brand-100 dark:bg-brand-900/30',
    iconColor: 'text-brand-600 dark:text-brand-400',
  },
  {
    icon: Zap,
    titleKey: 'features.performance',
    descKey: 'features.performance_desc',
    gradient: 'from-indigo-500 to-brand-600',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    icon: Shield,
    titleKey: 'features.typescript',
    descKey: 'features.typescript_desc',
    gradient: 'from-brand-500 to-brand-600',
    iconBg: 'bg-brand-100 dark:bg-brand-900/30',
    iconColor: 'text-brand-600 dark:text-brand-400',
  },
  {
    icon: Palette,
    titleKey: 'features.framework',
    descKey: 'features.framework_desc',
    gradient: 'from-sky-500 to-brand-600',
    iconBg: 'bg-sky-100 dark:bg-sky-900/30',
    iconColor: 'text-sky-600 dark:text-sky-400',
  },
  {
    icon: Layers,
    titleKey: 'features.modular',
    descKey: 'features.modular_desc',
    gradient: 'from-indigo-500 to-brand-600',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    icon: GitBranch,
    titleKey: 'features.immutable',
    descKey: 'features.immutable_desc',
    gradient: 'from-brand-500 to-sky-600',
    iconBg: 'bg-brand-100 dark:bg-brand-900/30',
    iconColor: 'text-brand-600 dark:text-brand-400',
  },
];
</script>

<template>
  <section class="w-full py-16 sm:py-20 bg-white dark:bg-slate-950">
    <div class="px-6 mx-auto max-w-7xl">
      <div class="flex items-center gap-3">
        <div
          class="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/40"
        >
          <Zap class="w-5 h-5 text-brand-600 dark:text-brand-400" />
        </div>
        <div>
          <h2 class="text-2xl font-bold font-display">
            {{ t('features.title') }}
          </h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            {{ t('features.subtitle') }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-5 mt-2 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="(feature, i) in features"
          :key="feature.titleKey"
          :ref="
            (el) => {
              if (el) cardRefs[i] = el as HTMLElement;
            }
          "
          :data-index="i"
          class="group relative p-6 transition-all duration-500 border rounded-2xl bg-white/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 hover:shadow-xl hover:-translate-y-1 hover:border-brand-500/30"
          :class="
            visibleCards.has(i)
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
          "
        >
          <div
            :class="[
              'absolute top-0 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300',
              feature.gradient,
            ]"
          ></div>

          <div class="flex items-start gap-4">
            <div
              :class="[
                'flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-110',
                feature.iconBg,
              ]"
            >
              <component
                :is="feature.icon"
                class="w-5 h-5"
                :class="feature.iconColor"
              />
            </div>
            <div>
              <h3 class="font-semibold text-slate-800 dark:text-slate-100">
                {{ t(feature.titleKey) }}
              </h3>
              <p
                class="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400"
              >
                {{ t(feature.descKey) }}
              </p>
            </div>
          </div>

          <div
            :class="[
              'absolute -bottom-2 -right-2 w-16 h-16 rounded-full bg-gradient-to-br blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500',
              feature.gradient,
            ]"
          ></div>
        </div>
      </div>
    </div>
  </section>
</template>
