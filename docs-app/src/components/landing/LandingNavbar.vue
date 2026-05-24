<script setup lang="ts">
import { ref, inject, onMounted, onBeforeUnmount } from 'vue';
import { Sun, Moon, Menu, X, Heart, Globe } from '@lucide/vue';
import { I18N_KEY, type I18nContext, type Locale } from '@/i18n';

const { t, locale, setLocale } = inject(I18N_KEY)! as I18nContext;

const mobileMenuOpen = ref(false);
const scrolled = ref(false);
const isDarkMode = ref(false);
const langOpen = ref(false);

function initTheme() {
  const saved = localStorage.getItem('tg-theme');
  if (saved) {
    isDarkMode.value = saved === 'dark';
  } else {
    isDarkMode.value = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
  }
  document.documentElement.classList.toggle('dark', isDarkMode.value);
}

function toggleTheme() {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('tg-theme', isDarkMode.value ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', isDarkMode.value);
}

const languages: { code: Locale; label: string; flag: string }[] = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

function changeLang(code: Locale) {
  setLocale(code);
  langOpen.value = false;
}

let onScroll: (() => void) | null = null;
onMounted(() => {
  initTheme();
  onScroll = () => {
    scrolled.value = window.scrollY > 20;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});
onBeforeUnmount(() => {
  if (onScroll) {
    window.removeEventListener('scroll', onScroll);
  }
});
</script>

<template>
  <nav
    :class="[
      'flex items-center justify-between w-full px-4 sm:px-6 py-3 transition-all duration-300',
      scrolled
        ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-sm border-b border-slate-200/50 dark:border-slate-800/50'
        : 'bg-transparent',
    ]"
  >
    <div class="flex items-center space-x-3">
      <router-link to="/" class="inline-block" aria-label="TimeGuard home">
        <img
          src="https://raw.githubusercontent.com/Berea-Soft/time-guard/refs/heads/main/src/assets/logo.pnglogo.png"
          alt="TimeGuard Logo"
          class="object-contain h-8 transition-transform w-36 hover:scale-105"
        />
      </router-link>
    </div>

    <!-- Desktop nav -->
    <div class="items-center hidden space-x-1 lg:flex">
      <router-link
        to="/"
        class="px-4 py-2 text-sm font-medium transition-all rounded-lg"
        :class="
          scrolled
            ? 'text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-950'
            : 'text-slate-950/85 hover:text-slate-800 hover:bg-slate-500/10 dark:hover:bg-slate-900/10 dark:text-slate-100 dark:hover:text-slate-300'
        "
      >
        {{ t('nav.home') }}
      </router-link>
      <router-link
        to="/docs"
        class="px-4 py-2 text-sm font-medium transition-all rounded-lg"
        :class="
          scrolled
            ? 'text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-950'
            : 'text-slate-950/85 hover:text-slate-800 hover:bg-slate-500/10 dark:hover:bg-slate-900/10 dark:text-slate-100 dark:hover:text-slate-300'
        "
      >
        {{ t('nav.docs') }}
      </router-link>
      <router-link
        to="/demos"
        class="px-4 py-2 text-sm font-medium transition-all rounded-lg"
        :class="
          scrolled
            ? 'text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-950'
            : 'text-slate-950/85 hover:text-slate-800 hover:bg-slate-500/10 dark:hover:bg-slate-900/10 dark:text-slate-100 dark:hover:text-slate-300'
        "
      >
        {{ t('nav.demos') }}
      </router-link>

      <!-- Language selector -->
      <div class="relative">
        <button
          @click="langOpen = !langOpen"
          class="flex items-center gap-1.5 px-2.5 py-2 text-sm font-medium transition-all rounded-lg"
          :class="
            scrolled
              ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              : 'text-slate-950/85 hover:text-slate-800 hover:bg-slate-500/10 dark:hover:bg-slate-900/10 dark:text-slate-100 dark:hover:text-slate-300'
          "
          :title="t('nav.language')"
        >
          <Globe class="w-4 h-4" />
          <span class="text-xs">{{ locale === 'es' ? '🇪🇸' : '🇬🇧' }}</span>
        </button>
        <div
          v-if="langOpen"
          class="absolute right-0 z-50 mt-1 overflow-hidden bg-white border rounded-xl shadow-xl dark:bg-slate-900 border-slate-200 dark:border-slate-700 min-w-[140px]"
        >
          <button
            v-for="lang in languages"
            :key="lang.code"
            @click="changeLang(lang.code)"
            class="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            :class="
              locale === lang.code
                ? 'text-brand-600 dark:text-brand-400 font-semibold'
                : 'text-slate-700 dark:text-slate-300'
            "
          >
            <span class="text-base">{{ lang.flag }}</span>
            {{ lang.label }}
          </button>
        </div>
      </div>

      <!-- Sponsor button -->
      <a
        href="https://github.com/sponsors/Berea-Soft"
        target="_blank"
        class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-lg bg-linear-to-r from-brand-600 to-sky-600 hover:from-brand-500 hover:to-sky-500 text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 hover:scale-105 active:scale-95"
      >
        <Heart class="w-3.5 h-3.5" />
        {{ t('nav.sponsor') }}
      </a>

      <a
        href="https://github.com/Berea-Soft/time-guard"
        target="_blank"
        class="p-2 transition-all rounded-lg"
        :class="
          scrolled
            ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            : 'text-slate950/85 hover:text-slate-800 hover:bg-slate-500/10 dark:hover:bg-slate-900/10 dark:text-slate-100 dark:hover:text-slate-300'
        "
        title="GitHub"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
          />
        </svg>
      </a>

      <div
        class="w-px h-5 mx-1"
        :class="scrolled ? 'bg-slate-200 dark:bg-slate-700' : 'bg-white/20'"
      ></div>

      <button
        @click="toggleTheme()"
        class="p-2 transition-all rounded-lg"
        :class="
          scrolled
            ? 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
            : 'text-slate-950/85 hover:text-slate-800 hover:bg-slate-500/10 dark:hover:bg-slate-900/10 dark:text-slate-100 dark:hover:text-slate-300'
        "
        :title="isDarkMode ? t('nav.light_mode') : t('nav.dark_mode')"
      >
        <Sun v-if="!isDarkMode" class="w-4 h-4" />
        <Moon v-else class="w-4 h-4" />
      </button>
    </div>

    <!-- Mobile hamburger -->
    <button
      @click="mobileMenuOpen = !mobileMenuOpen"
      class="p-2 lg:hidden"
      :class="scrolled ? 'text-slate-700 dark:text-slate-300' : 'text-white'"
    >
      <Menu v-if="!mobileMenuOpen" class="w-5 h-5" />
      <X v-else class="w-5 h-5" />
    </button>
  </nav>

  <!-- Mobile menu -->
  <div
    v-if="mobileMenuOpen"
    class="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl lg:hidden"
  >
    <router-link
      to="/docs"
      class="text-2xl font-semibold text-slate-800 dark:text-slate-100"
      @click="mobileMenuOpen = false"
    >
      {{ t('nav.docs') }}
    </router-link>
    <router-link
      to="/demos"
      class="text-2xl font-semibold text-slate-800 dark:text-slate-100"
      @click="mobileMenuOpen = false"
    >
      {{ t('nav.demos') }}
    </router-link>

    <!-- Mobile language selector -->
    <div class="flex items-center gap-3">
      <button
        v-for="lang in languages"
        :key="lang.code"
        @click="
          changeLang(lang.code);
          mobileMenuOpen = false;
        "
        class="flex items-center gap-2 px-4 py-2 text-lg font-medium transition-all rounded-xl"
        :class="
          locale === lang.code
            ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        "
      >
        <span class="text-xl">{{ lang.flag }}</span>
        {{ lang.label }}
      </button>
    </div>

    <a
      href="https://github.com/sponsors/Berea-Soft"
      target="_blank"
      class="inline-flex items-center gap-2 px-6 py-3 text-lg font-semibold text-white transition-all duration-300 shadow-lg rounded-xl bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-500 hover:to-sky-500"
      @click="mobileMenuOpen = false"
    >
      <Heart class="w-5 h-5" /> {{ t('nav.sponsor') }}
    </a>
    <a
      href="https://github.com/Berea-Soft/time-guard"
      target="_blank"
      class="inline-flex items-center gap-2 text-2xl font-semibold text-slate-800 dark:text-slate-100"
    >
      <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
        />
      </svg>
      GitHub
    </a>

    <button
      @click="
        toggleTheme();
        mobileMenuOpen = false;
      "
      class="px-6 py-3 mt-4 text-sm font-medium transition-all border rounded-full border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
    >
      {{
        isDarkMode ? '☀️ ' + t('nav.light_mode') : '🌙 ' + t('nav.dark_mode')
      }}
    </button>
  </div>
</template>
