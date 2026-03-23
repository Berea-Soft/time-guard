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

    // Run all 3 build steps (unified vite.config.ts)
    execSync('npx vite build',            { cwd: root, stdio: 'pipe', timeout: 60000 });
    execSync('npx vite build --mode full', { cwd: root, stdio: 'pipe', timeout: 60000 });
    execSync('npx vite build --mode umd',  { cwd: root, stdio: 'pipe', timeout: 60000 });

    const allDistFiles = readdirSync(distDir).filter(f => f !== 'types');

    // ── No shared chunks or stale artifacts ──
    const unwanted = allDistFiles.filter(f =>
      f.includes('locales.esm') ||
      f.includes('locales2') ||
      f.includes('_internal') ||
      // Old naming: bare .js without .es./.umd./.iife. (except .cjs)
      (/^(?!time-guard\.).*\.js$/.test(f) && !f.includes('.es.') && !f.includes('.umd.') && !f.includes('.iife.'))
    );
    expect(unwanted, `Unexpected files in dist: ${unwanted.join(', ')}`).toEqual([]);

    // ── All expected files are present ──
    const expected = [
      'time-guard.es.js', 'time-guard.cjs', 'time-guard.umd.js', 'time-guard.iife.js',
      'full.es.js', 'full.cjs',
      'locales.es.js', 'locales.cjs',
      'calendars.es.js', 'calendars.cjs',
      'plugin-relative-time.es.js', 'plugin-relative-time.cjs',
      'plugin-duration.es.js', 'plugin-duration.cjs',
      'plugin-advanced-format.es.js', 'plugin-advanced-format.cjs',
    ];
    for (const file of expected) {
      expect(allDistFiles, `Missing expected file: ${file}`).toContain(file);
    }

    // ── Core bundle must NOT contain the polyfill import statement ──
    const coreES = readFileSync(join(distDir, 'time-guard.es.js'), 'utf-8');
    const firstLine = coreES.split('\n').find(l => l.startsWith('import'));
    expect(firstLine ?? 'no imports').not.toContain('@js-temporal/polyfill');

    // ── Size sanity checks (core gzip < 8 KB) ──
    const coreGzip = gzipSync(readFileSync(join(distDir, 'time-guard.es.js')));
    expect(coreGzip.length).toBeLessThan(8 * 1024);
  }, 180000);
});
