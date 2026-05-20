import { defineConfig, type UserConfig } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { existsSync, readFileSync, rmSync } from 'fs';
import dts from 'vite-plugin-dts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pack = JSON.parse(
  readFileSync(resolve(__dirname, 'package.json'), 'utf-8'),
);

const banner = `/*! time-guard v${
  pack.version
} | (c) ${new Date().getFullYear()} Berea-Soft | MIT License | https://github.com/Berea-Soft/time-guard */`;

const distTypesSrcDir = resolve(__dirname, 'dist', 'types', 'src');

const fileName = (format: string, entryName: string) =>
  format === 'cjs' ? `${entryName}.cjs` : `${entryName}.${format}.js`;

export default defineConfig(({ mode }): UserConfig => {
  const shared = {
    define: { __VERSION__: JSON.stringify(pack.version) },
  };

  const isUmd = mode === 'umd';

  return {
    ...shared,
    build: {
      lib: {
        entry: isUmd
          ? resolve(__dirname, 'src/index.ts')
          : {
              'time-guard': resolve(__dirname, 'src/index.ts'),
              'locales/index': resolve(__dirname, 'src/locales/index.ts'),
              'calendars/index': resolve(__dirname, 'src/calendars/index.ts'),
              'plugins/relative-time': resolve(
                __dirname,
                'src/plugins/relative-time/index.ts',
              ),
              'plugins/duration': resolve(
                __dirname,
                'src/plugins/duration/index.ts',
              ),
              'plugins/advanced-format': resolve(
                __dirname,
                'src/plugins/advanced-format/index.ts',
              ),
            },
        name: 'BereasoftTimeGuard',
        fileName: isUmd
          ? (format: string) =>
              format === 'cjs' ? 'time-guard.cjs' : `time-guard.${format}.js`
          : fileName,
        formats: isUmd ? ['umd', 'iife', 'es', 'cjs'] : ['es', 'cjs'],
      },
      rollupOptions: {
        output: {
          banner,
          exports: 'named' as const,
        },
      },
      emptyOutDir: isUmd ? false : true, // Solo limpiamos para el modo no-UMD
      sourcemap: true,
      minify: 'oxc',
      reportCompressedSize: true,
    },
    plugins: [
      dts({
        rollupTypes: false,
        insertTypesEntry: true,
        copyDtsFiles: true,
        entryRoot: resolve(__dirname, 'src'),
        outDir: resolve(__dirname, 'dist/types'),
        strictOutput: true,
        include: ['src/**/*.ts'],
        exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
        beforeWriteFile: (filePath, content) => {
          const normalizedPath = filePath.replace(
            /([\\/])dist\1types\1src(?=[\\/])/,
            '$1dist$1types',
          );
          return { filePath: normalizedPath, content };
        },
        afterBuild: () => {
          if (existsSync(distTypesSrcDir)) {
            rmSync(distTypesSrcDir, { recursive: true, force: true });
          }
        },
      }),
    ],
  };
});