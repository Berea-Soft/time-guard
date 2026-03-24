/**
 * Generates per-subpath .d.ts proxy files so that each
 * package.json "exports" → "types" resolves correctly.
 *
 * Run after vite-plugin-dts has emitted dist/types/time-guard.d.ts
 */
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const typesDir = resolve(__dirname, 'dist/types');

const proxies = {
  'plugins/relative-time.d.ts': [
    `export { RelativeTimePlugin, relativeTimePlugin } from '../time-guard';`,
    `export { relativeTimePlugin as default } from '../time-guard';`,
    `export type { RelativeTimeConfig, RelativeTimeFormats, RelativeTimeThreshold } from '../time-guard';`,
  ],
  'plugins/duration.d.ts': [
    `export { DurationPlugin, Duration, durationPlugin } from '../time-guard';`,
    `export { durationPlugin as default } from '../time-guard';`,
    `export type { IDuration, DurationInput, DurationObject, DurationUnit } from '../time-guard';`,
  ],
  'plugins/advanced-format.d.ts': [
    `export { AdvancedFormatPlugin, advancedFormatPlugin } from '../time-guard';`,
    `export { advancedFormatPlugin as default } from '../time-guard';`,
  ],
  'locales.d.ts': [
    `export { getAvailableLocales, LOCALES_COUNT, ALL_LOCALES, registerAllLocales } from './time-guard';`,
  ],
  'calendars.d.ts': [
    `export { IslamicCalendar, HebrewCalendar, ChineseCalendar, JapaneseCalendar, BuddhistCalendar } from './time-guard';`,
  ],
  'full.d.ts': [
    `export * from './time-guard';`,
  ],
};

for (const [file, lines] of Object.entries(proxies)) {
  const dest = resolve(typesDir, file);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, lines.join('\n') + '\n', 'utf-8');
}

console.log('✓ Type proxies generated');
