import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, rmSync } from 'fs';
import { join } from 'path';
import { gzipSync } from 'zlib';
import { execSync } from 'child_process';

describe('Bundle Size Report', () => {
  it('should produce a clean build with no shared chunks', () => {
    const root = join(__dirname, '..');
    const distDir = join(root, 'dist');

    // Clean dist/ completely before rebuilding
    rmSync(distDir, { recursive: true, force: true });

    // Run current build steps (angular is built separately with esbuild)
    execSync('npx vite build', { cwd: root, stdio: 'pipe', timeout: 60000 });
    execSync('npx vite build --mode umd', {
      cwd: root,
      stdio: 'pipe',
      timeout: 60000,
    });

    const allDistFiles = readdirSync(distDir, { recursive: true })
      .map((f) => f.toString().replace(/\\/g, '/'))
      .filter((f) => !f.startsWith('types'));

    // ── No shared chunks or stale artifacts ──
    // Allow: locales-xxxx.js (shared i18n chunks) and core-xxxx.js (Vite shared chunks)
    const unwanted = allDistFiles.filter(
      (f) =>
        f.includes('locales.esm') ||
        f.includes('locales2') ||
        f.includes('_internal') ||
        // Bare .js at root level that isn't time-guard.* or core-xxxx or locales-xxxx
        (/^(?!time-guard\.).*\.js$/.test(f.split('/').pop() || '') &&
          !f.includes('.es.') &&
          !f.includes('.umd.') &&
          !f.includes('.iife.') &&
          !f.includes('/') &&
          !/locales-[A-Za-z0-9_-]+\.(js|cjs)$/.test(f) &&
          !/^core-[A-Za-z0-9_-]+\.js$/.test(f.split('/').pop() || '')),
    );
    expect(
      unwanted,
      `Unexpected files in dist: ${unwanted.join(', ')}`,
    ).toEqual([]);

    // ── All expected files are present ──
    // Angular se build aparte (vite build --mode angular), no en el build normal
    const expected = [
      'time-guard.es.js',
      'time-guard.cjs',
      'time-guard.umd.js',
      'time-guard.iife.js',
      'native/index.es.js',
      'native/index.cjs',
      'react/index.es.js',
      'react/index.cjs',
      'vue/index.es.js',
      'vue/index.cjs',
      'svelte/index.es.js',
      'svelte/index.cjs',
      'solid/index.es.js',
      'solid/index.cjs',
      'qwik/index.es.js',
      'qwik/index.cjs',
      'locales/index.es.js',
      'locales/index.cjs',
      'calendars/index.es.js',
      'calendars/index.cjs',
      'plugins/relative-time.es.js',
      'plugins/relative-time.cjs',
      'plugins/duration.es.js',
      'plugins/duration.cjs',
      'plugins/advanced-format.es.js',
      'plugins/advanced-format.cjs',
    ];
    for (const file of expected) {
      expect(allDistFiles, `Missing expected file: ${file}`).toContain(file);
    }

    // ── Main bundle should include polyfill import (backward-compatible full entry) ──
    const coreES = readFileSync(join(distDir, 'time-guard.es.js'), 'utf-8');
    const hasPolyfillImport = coreES
      .split('\n')
      .some(
        (l) => l.startsWith('import') && l.includes('@js-temporal/polyfill'),
      );
    const hasRuntimeMessage =
      coreES.includes('Temporal API not loaded') ||
      coreES.includes('Make sure @js-temporal/polyfill');
    expect(
      hasPolyfillImport || hasRuntimeMessage,
      'Missing polyfill import or runtime message referencing @js-temporal/polyfill',
    ).toBe(true);

    // ── Native bundle should NOT import the polyfill ──
    const nativeES = readFileSync(
      join(distDir, 'native', 'index.es.js'),
      'utf-8',
    );
    const nativeHasPolyfill = nativeES
      .split('\n')
      .some(
        (l) => l.startsWith('import') && l.includes('@js-temporal/polyfill'),
      );
    expect(
      nativeHasPolyfill,
      'Native bundle must not import or bundle @js-temporal/polyfill',
    ).toBe(false);

    // ── Size sanity checks (full-compatible entry remains within expected budget)
    const coreGzip = gzipSync(readFileSync(join(distDir, 'time-guard.es.js')));
    expect(coreGzip.length).toBeLessThan(80 * 1024);

    // ── Size sanity checks (native mode should be extremely lightweight)
    const nativeGzip = gzipSync(
      readFileSync(join(distDir, 'native', 'index.es.js')),
    );
    expect(nativeGzip.length).toBeLessThan(20 * 1024);
  }, 180000);

  it('should build Angular separately with esbuild', () => {
    const root = join(__dirname, '..');
    const distDir = join(root, 'dist');

    // Build angular separately with esbuild mode
    execSync('npx vite build --mode angular', {
      cwd: root,
      stdio: 'pipe',
      timeout: 60000,
    });

    const allDistFiles = readdirSync(distDir, { recursive: true })
      .map((f) => f.toString().replace(/\\/g, '/'))
      .filter((f) => !f.startsWith('types'));

    expect(allDistFiles).toContain('angular/index.es.js');
    expect(allDistFiles).toContain('angular/index.cjs');
  }, 60000);
});
