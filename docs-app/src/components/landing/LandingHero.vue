<script setup lang="ts">
import { ref, inject, onMounted } from 'vue';
import {
  Star,
  Tag,
  Clock,
  Globe,
  Puzzle,
  ArrowRight,
  Code2,
  Heart,
  Users,
  type LucideIcon,
} from '@lucide/vue';
import { I18N_KEY, type I18nContext } from '@/i18n';

const { t } = inject(I18N_KEY)! as I18nContext;

const props = defineProps<{
  stars: number | null;
  version: string;
  contributorCount?: number;
}>();

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  delay: number;
}

const heroFeatures: { icon: LucideIcon; label: string }[] = [
  { icon: Clock, label: 'hero.feature_precision' },
  { icon: Globe, label: 'hero.feature_locales' },
  { icon: Puzzle, label: 'hero.feature_plugins' },
  { icon: Star, label: 'hero.feature_oss' },
];

const particles = ref<Particle[]>([]);

function generateParticles() {
  const items: Particle[] = [];
  for (let i = 0; i < 20; i++) {
    items.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      opacity: Math.random() * 0.3 + 0.1,
      speed: Math.random() * 3 + 2,
      delay: Math.random() * 5,
    });
  }
  particles.value = items;
}

onMounted(() => {
  generateParticles();
});
</script>

<template>
  <section
    class="relative w-full overflow-hidden min-h-[560px] flex items-center"
  >
    <div
      class="absolute inset-0 bg-gradient-to-br from-brand-700 via-blue-800 to-indigo-950 animate-gradient-bg"
    ></div>

    <div
      class="absolute inset-0 opacity-15 mix-blend-overlay"
      style="
        background-image: url('data:image/svg+xml,%253Csvg%2520viewBox%3D%270%200%20256%20256%27%2520xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%253E%253Cfilter%2520id%3D%27noise%27%253E%253CfeTurbulence%2520type%3D%27fractalNoise%27%2520baseFrequency%3D%270.9%27%2520numOctaves%3D%274%27%2520stitchTiles%3D%27stitch%27%2F%253E%253C%2Ffilter%253E%253Crect%2520width%3D%27100%2525%27%2520height%3D%27100%2525%27%2520filter%3D%27url(%2523noise)%27%2520opacity%3D%270.5%27%2F%253E%253C%2Fsvg%253E');
      "
    ></div>

    <div class="absolute inset-0 pointer-events-none">
      <div
        v-for="p in particles"
        :key="p.id"
        class="absolute rounded-full bg-white/20 animate-float-particle"
        :style="{
          left: p.x + '%',
          top: p.y + '%',
          width: p.size + 'px',
          height: p.size + 'px',
          opacity: p.opacity,
          animationDuration: p.speed + 's',
          animationDelay: p.delay + 's',
        }"
      ></div>
    </div>

    <div
      class="absolute rounded-full pointer-events-none -right-32 -top-32 w-96 h-96 bg-white/10 blur-3xl"
    ></div>
    <div
      class="absolute rounded-full pointer-events-none -left-32 -bottom-32 w-80 h-80 bg-sky-400/10 blur-3xl"
    ></div>

    <div
      class="relative z-10 flex flex-col items-center justify-center w-full px-6 py-20 mx-auto space-y-8 text-center max-w-7xl sm:py-24"
    >
      <h1
        class="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl font-display text-balance animate-fade-in"
        style="animation-delay: 0.2s"
      >
        {{ t('hero.title') }}<br />
        <span
          class="text-transparent bg-clip-text bg-linear-to-r from-amber-200 via-yellow-300 to-orange-200"
        >
          {{ t('hero.title_accent') }}
        </span>
      </h1>

      <p
        class="max-w-2xl text-lg leading-relaxed text-white/80 animate-fade-in"
        style="animation-delay: 0.3s"
        v-html="t('hero.subtitle')"
      ></p>

      <div
        class="flex flex-wrap items-center justify-center gap-4 animate-fade-in"
        style="animation-delay: 0.4s"
      >
        <router-link
          to="/docs"
          class="inline-flex items-center gap-2 px-6 py-3 font-semibold text-indigo-700 transition-all duration-300 bg-white rounded-full shadow-lg group hover:shadow-xl hover:scale-105 active:scale-95"
        >
          {{ t('hero.cta_docs') }}
          <ArrowRight
            class="w-4 h-4 transition-transform group-hover:translate-x-1"
          />
        </router-link>
        <router-link
          to="/demos"
          class="inline-flex items-center gap-2 px-6 py-3 font-medium text-white transition-all duration-300 border rounded-full group border-white/30 hover:bg-white/10 hover:scale-105 active:scale-95"
        >
          <Code2 class="w-4 h-4" />
          {{ t('hero.cta_examples') }}
        </router-link>
        <a
          href="https://github.com/sponsors/Berea-Soft"
          target="_blank"
          class="inline-flex items-center gap-2 px-6 py-3 font-medium text-white transition-all duration-300 rounded-full shadow-lg group bg-gradient-to-r from-brand-500 to-sky-500 hover:from-brand-400 hover:to-sky-400 hover:scale-105 active:scale-95 shadow-brand-500/20"
        >
          <Heart class="w-4 h-4 transition-transform group-hover:scale-110" />
          {{ t('hero.cta_sponsor') }}
        </a>
      </div>

      <div
        class="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm text-white/70 animate-fade-in"
        style="animation-delay: 0.5s"
      >
        <div class="flex items-center gap-2">
          <Star class="w-4 h-4 text-amber-300" />
          <span>{{ t('hero.stat_stars', { count: props.stars ?? 0 }) }}</span>
        </div>
        <div class="w-px h-4 bg-white/20"></div>
        <div class="flex items-center gap-2">
          <Tag class="w-4 h-4 text-amber-300" />
          <span>v{{ props.version }}</span>
        </div>
        <div
          v-if="props.contributorCount"
          class="items-center hidden gap-2 sm:flex"
        >
          <div class="w-px h-4 bg-white/20"></div>
          <Users class="w-4 h-4 text-amber-300" />
          <span>{{
            t('hero.stat_contributors', { count: props.contributorCount })
          }}</span>
        </div>
      </div>

      <div
        class="grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4 animate-fade-in"
        style="animation-delay: 0.6s"
      >
        <div
          v-for="(feature, i) in heroFeatures"
          :key="feature.label"
          class="flex items-center gap-2.5 px-4 py-2.5 transition-all duration-300 rounded-xl bg-white/8 backdrop-blur-sm border border-white/5 hover:bg-white/15 hover:scale-105 group animate-scale-in"
          :style="{ animationDelay: `${0.7 + i * 0.1}s` }"
        >
          <component
            :is="feature.icon"
            class="w-4 h-4 transition-transform text-white/80 group-hover:scale-110 group-hover:text-white"
          />
          <span class="text-sm font-medium text-white/90">{{
            t(feature.label)
          }}</span>
        </div>
      </div>
    </div>

    <div class="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
      <svg
        class="relative w-full h-12 sm:h-16"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,40 C240,120 480,0 720,40 C960,80 1200,0 1440,40 L1440,120 L0,120 Z"
          fill="rgba(255,255,255,0.04)"
        ></path>
      </svg>
    </div>
  </section>
</template>

<style scoped>
@keyframes gradient-bg {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.animate-gradient-bg {
  background-size: 200% 200%;
  animation: gradient-bg 8s ease infinite;
}

@keyframes float-particle {
  0%,
  100% {
    transform: translateY(0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  50% {
    transform: translateY(-30px) scale(1.2);
    opacity: 0.3;
  }
  90% {
    opacity: 0.6;
  }
}
.animate-float-particle {
  animation: float-particle 4s ease-in-out infinite;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.6s ease-out both;
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-scale-in {
  animation: scale-in 0.4s ease-out both;
}
</style>
