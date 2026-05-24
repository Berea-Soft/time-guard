<script setup lang="ts">
import { inject, ref, onMounted } from 'vue';
import { Heart, ExternalLink } from '@lucide/vue';
import { I18N_KEY, type I18nContext } from '@/i18n';

const { t } = inject(I18N_KEY)! as I18nContext;

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
    { threshold: 0.08 },
  );
  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }
});

defineProps<{ sticky?: boolean }>();
</script>

<template>
  <footer
    ref="sectionRef"
    class="relative w-full overflow-hidden transition-all duration-700"
    :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
  >
    <div
      class="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 bg-animate"
    ></div>

    <div
      class="absolute rounded-full -left-20 -bottom-20 w-60 h-60 bg-sky-500/5 blur-3xl"
    ></div>
    <div
      class="absolute w-48 h-48 rounded-full -right-20 -top-20 bg-brand-500/10 blur-3xl"
    ></div>

    <div class="relative z-10 px-8 py-12 sm:py-16">
      <div
        class="grid max-w-5xl grid-cols-1 gap-10 mx-auto sm:grid-cols-2 lg:grid-cols-4"
      >
        <div class="space-y-4 lg:col-span-2">
          <router-link to="/" class="inline-block">
            <img
              src="https://raw.githubusercontent.com/Berea-Soft/time-guard/refs/heads/main/src/assets/logo.png"
              alt="TimeGuard"
              class="h-auto transition-transform w-36 hover:scale-105 brightness-0 invert"
            />
          </router-link>
          <p class="max-w-sm text-sm leading-relaxed text-white/75">
            {{ t('footer.description') }}
          </p>
          <div class="flex items-center gap-2 text-xs text-white/60">
            <Heart class="w-3 h-3 text-red-300" />
            {{ t('footer.mit') }}
          </div>
        </div>

        <div class="space-y-3">
          <h4 class="text-xs font-bold tracking-widest uppercase text-white/50">
            {{ t('footer.product') }}
          </h4>
          <ul class="space-y-2">
            <li>
              <router-link
                to="/docs"
                class="text-sm transition-colors text-white/80 hover:text-white"
                >{{ t('footer.docs') }}</router-link
              >
            </li>
            <li>
              <router-link
                to="/demos"
                class="text-sm transition-colors text-white/80 hover:text-white"
                >{{ t('footer.examples') }}</router-link
              >
            </li>
            <li>
              <a
                href="https://www.npmjs.com/package/@bereasoftware/time-guard"
                target="_blank"
                class="inline-flex items-center gap-1 text-sm transition-colors text-white/80 hover:text-white"
                >{{ t('footer.npm') }} <ExternalLink class="w-3 h-3"
              /></a>
            </li>
          </ul>
        </div>

        <div class="space-y-3">
          <h4 class="text-xs font-bold tracking-widest uppercase text-white/50">
            {{ t('footer.community') }}
          </h4>
          <ul class="space-y-2">
            <li>
              <a
                href="https://github.com/Berea-Soft/time-guard"
                target="_blank"
                class="inline-flex items-center gap-2 text-sm transition-colors text-white/80 hover:text-white"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                  />
                </svg>
                {{ t('footer.github') }}
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Berea-Soft/time-guard/issues"
                target="_blank"
                class="inline-flex items-center gap-1 text-sm transition-colors text-white/80 hover:text-white"
                >{{ t('footer.issues') }} <ExternalLink class="w-3 h-3"
              /></a>
            </li>
            <li>
              <a
                href="https://github.com/Berea-Soft/time-guard/blob/main/CONTRIBUTING.md"
                target="_blank"
                class="inline-flex items-center gap-1 text-sm transition-colors text-white/80 hover:text-white"
                >{{ t('footer.contribute') }} <ExternalLink class="w-3 h-3"
              /></a>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="flex flex-col items-center justify-between gap-4 pt-10 mt-10 border-t border-white/10 sm:flex-row"
      >
        <p class="text-xs text-white/50">
          {{ t('footer.copyright', { year: new Date().getFullYear() }) }}
        </p>
        <div class="flex items-center gap-4">
          <router-link
            to="/docs"
            class="text-xs transition-colors text-white/50 hover:text-white/80"
            >{{ t('footer.docs_link') }}</router-link
          >
          <a
            href="https://github.com/Berea-Soft/time-guard/blob/main/LICENSE"
            target="_blank"
            class="text-xs transition-colors text-white/50 hover:text-white/80"
            >{{ t('footer.license') }}</a
          >
          <a
            href="https://github.com/Berea-Soft/time-guard/blob/main/CODE_OF_CONDUCT.md"
            target="_blank"
            class="text-xs transition-colors text-white/50 hover:text-white/80"
            >{{ t('footer.code_of_conduct') }}</a
          >
        </div>
      </div>
    </div>

    <svg
      class="absolute bottom-0 left-0 w-full pointer-events-none"
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
    >
      <path
        d="M0,30 C240,90 480,0 720,30 C960,60 1200,0 1440,30 L1440 80 L0 80 Z"
        fill="rgba(0,0,0,0.08)"
      ></path>
    </svg>
  </footer>
</template>

<style scoped>
.bg-animate {
  background-size: 200% 200%;
  animation: gradientShift 10s ease infinite;
}
@keyframes gradientShift {
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
</style>
