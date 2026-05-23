<template>
  <div
    class="p-4 bg-white border rounded-lg dark:bg-slate-900 text-slate-900 dark:text-slate-100"
  >
    <h3 class="mb-2 text-lg font-semibold">{{ msg }}</h3>
    <p class="mb-3 text-sm">
      {{ t('demo_component.current_time', { time: current }) }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, inject } from 'vue';
import { I18N_KEY, type I18nContext } from '@/i18n';
import { TimeGuard } from '@bereasoftware/time-guard';

const { t } = inject(I18N_KEY) as I18nContext;

defineProps<{ msg?: string }>();
const current = ref(TimeGuard.now().format('time'));
let timer: number | null = null;
onMounted(() => {
  timer = window.setInterval(() => {
    current.value = TimeGuard.now().format('time');
  }, 1000);
});
onBeforeUnmount(() => {
  if (timer) {
    window.clearInterval(timer);
  }
});
</script>

<style scoped>
/* minimal demo styles */
</style>
