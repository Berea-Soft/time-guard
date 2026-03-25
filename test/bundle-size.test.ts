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

    // Run current build steps
    execSync('npx vite build',            { cwd: root, stdio: 'pipe', timeout: 60000 });
    execSync('npx vite build --mode umd',  { cwd: root, stdio: 'pipe', timeout: 60000 });

    const allDistFiles = readdirSync(distDir, { recursive: true })
      .map(f => f.toString().replace(/\\/g, '/'))
      .filter(f => !f.startsWith('types'));

    // ── No shared chunks or stale artifacts ──
    const unwanted = allDistFiles.filter(f =>
      f.includes('locales.esm') ||
      f.includes('locales2') ||
      f.includes('_internal') ||
      // Old naming: bare .js without .es./.umd./.iife. (except .cjs)
      (/^(?!time-guard\.).*\.js$/.test(f) && !f.includes('.es.') && !f.includes('.umd.') && !f.includes('.iife.') && !f.includes('/'))
    );
    expect(unwanted, `Unexpected files in dist: ${unwanted.join(', ')}`).toEqual([]);

    // ── All expected files are present ──
    const expected = [
      'time-guard.es.js', 'time-guard.cjs', 'time-guard.umd.js', 'time-guard.iife.js',
      'locales/index.es.js', 'locales/index.cjs',
      'calendars/index.es.js', 'calendars/index.cjs',
      'plugins/relative-time.es.js', 'plugins/relative-time.cjs',
      'plugins/duration.es.js', 'plugins/duration.cjs',
      'plugins/advanced-format.es.js', 'plugins/advanced-format.cjs',
    ];
    for (const file of expected) {
      expect(allDistFiles, `Missing expected file: ${file}`).toContain(file);
    }

    // ── Main bundle should include polyfill import (backward-compatible full entry) ──
    const coreES = readFileSync(join(distDir, 'time-guard.es.js'), 'utf-8');
    const firstLine = coreES.split('\n').find(l => l.startsWith('import'));
    expect(firstLine ?? 'no imports').toContain('@js-temporal/polyfill');

    // ── Size sanity checks (full-compatible entry remains within expected budget) ──
    const coreGzip = gzipSync(readFileSync(join(distDir, 'time-guard.es.js')));
    expect(coreGzip.length).toBeLessThan(20 * 1024);
  }, 180000);
});
