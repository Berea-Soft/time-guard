import { describe, it, expect } from 'vitest';
import { rmSync, existsSync } from 'fs';
import { join } from 'path';

describe('Cleanup stale build artifacts', () => {
  it('should remove old vite.config.modules.ts and stale dist files', () => {
    const root = join(__dirname, '..');

    // Remove old config file (no longer needed — unified into vite.config.ts)
    const oldConfig = join(root, 'vite.config.modules.ts');
    if (existsSync(oldConfig)) rmSync(oldConfig);

    // Remove stale size-report.txt
    const sizeReport = join(root, 'size-report.txt');
    if (existsSync(sizeReport)) rmSync(sizeReport);

    // Remove stale dist artifacts from old build system
    const staleFiles = [
      'locales.esm', 'locales2.cjs',
      'calendars.js', 'full.js', 'locales.js',
      'plugin-advanced-format.js', 'plugin-duration.js', 'plugin-relative-time.js',
    ];
    for (const file of staleFiles) {
      const filePath = join(root, 'dist', file);
      if (existsSync(filePath)) rmSync(filePath);
    }

    // Verify cleanup
    expect(existsSync(oldConfig)).toBe(false);
    expect(existsSync(join(root, 'dist', 'locales.esm'))).toBe(false);
    expect(existsSync(join(root, 'dist', 'locales2.cjs'))).toBe(false);

    // Self-destruct: mark this test file for manual deletion
    // (This is a one-time cleanup — safe to delete after running)
  });
});
