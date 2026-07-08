<script lang="ts">
/**
 * Real, live-running Angular example — executes the actual
 * @bereasoftware/time-guard/angular pipes (TimeGuardLiveFormatPipe,
 * TimeGuardRelativePipe) inside a StackBlitz sandbox (see
 * FrameworkSandbox.vue), not a Vue simulation.
 *
 * Exported as a plain named export (not inside <script setup>) so
 * DemoPage.vue's code panel can show this isolated snippet directly
 * instead of the whole wrapper file below.
 */
export const title = 'Angular';
export const slug = 'angular-demo';

export const code = `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TimeGuardLiveFormatPipe,
  TimeGuardRelativePipe,
} from '@bereasoftware/time-guard/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TimeGuardLiveFormatPipe, TimeGuardRelativePipe],
  template: \`
    <div style="font-family: monospace; min-height: 100vh; padding: 24px; color: #e2e8f0; background: #0f172a">
      <h1 style="color: #dd0031; font-size: 18px; margin-bottom: 16px">
        TimeGuard · Angular (timeGuardLiveFormat + timeGuardRelative)
      </h1>
      <p style="font-size: 32px; font-weight: 700">
        {{ ('now' | timeGuardLiveFormat:'HH:mm:ss.SSS':100:locale) }}
      </p>
      <p style="color: #94a3b8">
        {{ ('now' | timeGuardLiveFormat:'dddd, DD MMMM YYYY':1000:locale) }}
      </p>
      <p>Relativo: {{ pastDate | timeGuardRelative:locale }}</p>
      <button
        (click)="toggleLocale()"
        style="margin-top: 12px; padding: 8px 16px; cursor: pointer; background: rgba(221,0,49,0.12); color: #e2e8f0; border: 1px solid #dd0031; border-radius: 8px"
      >
        🌐 Cambiar a {{ locale === 'es' ? 'EN' : 'ES' }}
      </button>
    </div>
  \`,
})
export class AppComponent {
  locale: 'es' | 'en' = 'es';
  pastDate = new Date(Date.now() - 30 * 60 * 1000);

  toggleLocale(): void {
    this.locale = this.locale === 'es' ? 'en' : 'es';
  }
}
`;
</script>

<script setup lang="ts">
import FrameworkSandbox from '@/components/FrameworkSandbox.vue';
</script>

<template>
  <FrameworkSandbox
    framework="angular"
    :code="code"
    title="TimeGuard · Angular"
  />
</template>
