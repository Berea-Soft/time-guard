<script setup lang="ts">
import { ref, inject, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { I18N_KEY, type I18nContext, type Locale } from '@/i18n';
import { DOCS_DATA } from '@/data/docs.data';
import type { DocCategory } from '@/types';
import { Sun, Moon, Menu, X, Heart, Globe } from '@lucide/vue';

const { t, locale, setLocale } = inject(I18N_KEY)! as I18nContext;
const route = useRoute();

const categories = DOCS_DATA as DocCategory[];
const mobileSidebarOpen = ref(false);
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

// Close mobile sidebar on route change
watch(
  () => route.params.slug,
  () => {
    mobileSidebarOpen.value = false;
  },
);

let onScroll: (() => void) | null = null;
onMounted(() => {
  initTheme();
  onScroll = () => {
    scrolled.value = window.scrollY > 10;
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
  <div
    class="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
  >
    <!-- Premium Navbar -->
    <header
      class="sticky top-0 z-50 w-full transition-all duration-300"
      :class="
        scrolled
          ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-sm border-b border-slate-200/50 dark:border-slate-800/50'
          : 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800'
      "
    >
      <div class="flex items-center justify-between h-16 px-4 mx-auto sm:px-6">
        <div class="flex items-center gap-4">
          <button
            @click="mobileSidebarOpen = !mobileSidebarOpen"
            class="p-2 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 lg:hidden"
          >
            <Menu v-if="!mobileSidebarOpen" class="w-5 h-5" />
            <X v-else class="w-5 h-5" />
          </button>
          <router-link to="/" class="inline-block" aria-label="TimeGuard home">
            <img
              src="@assets/logo.png"
              alt="TimeGuard"
              class="object-contain w-32 h-7"
            />
          </router-link>
        </div>

        <div class="items-center hidden space-x-1 lg:flex">
          <router-link
            to="/"
            class="px-4 py-2 text-sm font-medium transition-all rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {{ t('nav.home') }}
          </router-link>
          <router-link
            to="/docs"
            class="px-4 py-2 text-sm font-medium transition-all rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {{ t('nav.docs') }}
          </router-link>
          <router-link
            to="/demos"
            class="px-4 py-2 text-sm font-medium transition-all rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {{ t('nav.demos') }}
          </router-link>

          <!-- Language selector -->
          <div class="relative">
            <button
              @click="langOpen = !langOpen"
              class="flex items-center gap-1.5 px-2.5 py-2 text-sm font-medium transition-all rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              :title="t('nav.language')"
            >
              <Globe class="w-4 h-4" />
              <span class="text-xs">{{ locale === 'es' ? '🇪🇸' : '🇬🇧' }}</span>
            </button>
            <div
              v-if="langOpen"
              class="absolute right-0 z-50 mt-1 overflow-hidden bg-white border rounded-xl shadow-xl dark:bg-slate-900 border-slate-200 dark:border-slate-700 min-w-[140px]"
              @click="langOpen = false"
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
            class="p-2 transition-all rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="GitHub"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
              />
            </svg>
          </a>

          <div class="w-px h-5 mx-1 bg-slate-200 dark:bg-slate-700"></div>

          <button
            @click="toggleTheme()"
            class="p-2 transition-all rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            :title="isDarkMode ? t('nav.light_mode') : t('nav.dark_mode')"
          >
            <Sun v-if="!isDarkMode" class="w-4 h-4" />
            <Moon v-else class="w-4 h-4" />
          </button>
        </div>

        <!-- Mobile menu trigger -->
        <div class="flex items-center gap-2 lg:hidden">
          <a
            href="https://github.com/sponsors/Berea-Soft"
            target="_blank"
            class="p-2 transition-all rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            :title="t('nav.sponsor')"
          >
            <Heart class="w-5 h-5" />
          </a>
          <button
            @click="toggleTheme()"
            class="p-2 transition-all rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            :title="isDarkMode ? t('nav.light_mode') : t('nav.dark_mode')"
          >
            <Sun v-if="!isDarkMode" class="w-4 h-4" />
            <Moon v-else class="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>

    <div class="flex flex-1 w-full max-w-full mx-auto">
      <!-- Desktop sidebar -->
      <aside
        class="hidden lg:block w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 p-6 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto bg-white/40 dark:bg-slate-950/40"
      >
        <div v-for="cat in categories" :key="cat.id" class="mb-8">
          <h3
            class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2"
          >
            <span class="flex-1">{{ cat.title }}</span>
          </h3>
          <ul class="space-y-0.5">
            <li v-for="item in cat.items" :key="item.id">
              <router-link
                :to="'/docs/' + item.id"
                class="block w-full px-3 py-2 text-xs transition-colors rounded-lg"
                :class="
                  route.params.slug === item.id ||
                  (!route.params.slug &&
                    route.path === '/docs' &&
                    categories[0].items[0].id === item.id)
                    ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200'
                "
              >
                {{ item.title }}
              </router-link>
            </li>
          </ul>
        </div>
      </aside>

      <!-- Mobile sidebar overlay -->
      <div v-if="mobileSidebarOpen" class="fixed inset-0 z-40 flex lg:hidden">
        <div
          class="absolute inset-0 bg-black/30 backdrop-blur-sm"
          @click="mobileSidebarOpen = false"
        />
        <aside
          class="relative w-72 max-w-[80vw] h-full overflow-y-auto bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-6 shadow-2xl"
        >
          <div class="flex items-center justify-between mb-6">
            <h2
              class="text-sm font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400"
            >
              {{ t('nav.docs') }}
            </h2>
            <button
              @click="mobileSidebarOpen = false"
              class="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
          <div v-for="cat in categories" :key="cat.id" class="mb-6">
            <h3
              class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3"
            >
              {{ cat.title }}
            </h3>
            <ul class="space-y-0.5">
              <li v-for="item in cat.items" :key="item.id">
                <router-link
                  :to="'/docs/' + item.id"
                  class="block px-3 py-2 text-sm transition-colors rounded-lg"
                  :class="
                    route.params.slug === item.id
                      ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                  "
                  @click="mobileSidebarOpen = false"
                >
                  {{ item.title }}
                </router-link>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <main class="flex flex-col flex-1 w-full min-w-0 p-4 sm:p-8">
        <router-view class="flex-1" />
        <footer
          class="pt-8 mt-20 text-xs text-center border-t border-slate-200 dark:border-slate-800 text-slate-500"
        >
          <p>{{ t('app_layout.copyright') }}</p>
        </footer>
      </main>
    </div>
  </div>
</template>
