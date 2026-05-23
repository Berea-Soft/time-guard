<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { ArrowUp } from '@lucide/vue';
import LandingNavbar from '@/components/landing/LandingNavbar.vue';
import LandingHero from '@/components/landing/LandingHero.vue';
import LandingInstall from '@/components/landing/LandingInstall.vue';
import LandingFeatures from '@/components/landing/LandingFeatures.vue';
import LandingDemo from '@/components/landing/LandingDemo.vue';
import LandingSponsors from '@/components/landing/LandingSponsors.vue';
import LandingContributors from '@/components/landing/LandingContributors.vue';
import LandingFooter from '@/components/landing/LandingFooter.vue';

const stars = ref<number | null>(null);
const version = ref<string>('0.0.0');
const showBackToTop = ref(false);

function onScroll() {
  showBackToTop.value = window.scrollY > 500;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

onMounted(async () => {
  window.addEventListener('scroll', onScroll, { passive: true });
  try {
    const res = await fetch(
      'https://api.github.com/repos/Berea-Soft/time-guard',
    );
    if (res.ok) {
      const data = await res.json();
      stars.value = data.stargazers_count;
    }
    const pkg = await fetch(
      'https://raw.githubusercontent.com/Berea-Soft/time-guard/main/package.json',
    );
    if (pkg.ok) {
      const p = await pkg.json();
      version.value = p.version;
    }
  } catch (e) {
    console.error('Failed to fetch github stats', e);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>

<template>
  <div
    class="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
  >
    <!-- Navbar with backdrop blur on scroll -->
    <div class="sticky top-0 z-50">
      <LandingNavbar />
    </div>

    <!-- Hero: full-width edge-to-edge -->
    <section>
      <LandingHero :stars="stars" :version="version" />
    </section>

    <!-- Content sections with alternating backgrounds -->
    <LandingDemo />
    <LandingInstall />
    <LandingFeatures />
    <LandingSponsors />
    <LandingContributors />

    <!-- Footer: full-width edge-to-edge -->
    <LandingFooter />

    <!-- Back to top button -->
    <button
      @click="scrollToTop"
      class="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 text-white transition-all duration-300 rounded-full shadow-xl bg-gradient-to-br from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-brand-500/20 hover:shadow-brand-500/40 hover:scale-110 active:scale-95"
      :class="
        showBackToTop
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      "
      aria-label="Back to top"
    >
      <ArrowUp class="w-5 h-5" />
    </button>
  </div>
</template>
