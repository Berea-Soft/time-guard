import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, rmSync } from 'fs';
import { join } from 'path';
import { pathToFileURL } from 'url';
import { gzipSync } from 'zlib';
import { execFileSync, execSync } from 'child_process';

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

    // ── Runtime behavior checks ──
    // Rolldown bundles @js-temporal/polyfill's code directly (it isn't
    // marked `external`), so its package name never survives as a literal
    // import specifier — grepping dist output for that string is a dead
    // end. Instead, spawn clean `node` processes (vitest's own globalThis
    // is already polluted with Temporal by test/setup.ts) and verify the
    // actual contract: the main entry must be fully self-contained (works
    // with zero pre-existing Temporal), and the native entry must contain
    // none of the polyfill (it fails fast without one).
    const mainEntryUrl = pathToFileURL(join(distDir, 'time-guard.es.js')).href;
    const mainStdout = execFileSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `import { TimeGuard } from ${JSON.stringify(mainEntryUrl)};` +
          `console.log(typeof TimeGuard.now().year());`,
      ],
      { encoding: 'utf-8' },
    ).trim();
    expect(
      mainStdout,
      'Main entry must self-install the Temporal polyfill and work with no pre-existing globalThis.Temporal',
    ).toBe('number');

    // This suite may itself be running on Node >=26, where the spawned
    // subprocess would otherwise have genuine native Temporal too — `delete
    // globalThis.Temporal` right before calling TimeGuard.now() forces the
    // "no Temporal" scenario deterministically regardless of host Node
    // version. Import statements are hoisted and evaluate before any other
    // top-level code, so placing the delete after the `import` line still
    // runs it before TimeGuard.now() is ever called.
    const nativeEntryUrl = pathToFileURL(
      join(distDir, 'native', 'index.es.js'),
    ).href;
    const nativeStdout = execFileSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `import { TimeGuard } from ${JSON.stringify(nativeEntryUrl)};` +
          `delete globalThis.Temporal;` +
          `try { TimeGuard.now(); console.log('unexpected-success'); }` +
          `catch (err) { console.log(err instanceof Error ? err.message : 'unknown-error'); }`,
      ],
      { encoding: 'utf-8' },
    ).trim();
    expect(
      nativeStdout,
      'Native entry must not bundle the polyfill: it should fail fast with no pre-existing globalThis.Temporal',
    ).toContain('Temporal API not found on globalThis');

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
