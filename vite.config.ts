import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';
import dts from 'vite-plugin-dts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pack = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));

const banner = `/*! time-guard v${
  pack.version
} | (c) ${new Date().getFullYear()} Berea-Soft | MIT License | https://github.com/Berea-Soft/time-guard */`;

export default defineConfig({
  define: {
    __VERSION__: JSON.stringify(pack.version),
  },
  build: {
    lib: {
      // Punto de entrada principal
      entry: resolve(__dirname, 'src/index.ts'),
      // Nombre global para UMD/IIFE: debe ser un identificador JS valido
      name: 'BereasoftTimeGuard',
      // Nombres de archivo personalizados
      fileName: (format) => `time-guard.${format === "cjs" ? "cjs" : `${format}.js`}`,
      formats: ["es", "cjs", "umd", "iife"],
    },
    rollupOptions: {
      output: {
        // Agregar banner a cada formato
        banner,
      },
    },
    // Limpiar la carpeta de salida antes de cada build
    emptyOutDir: true,
    // Generar source maps para facilitar el debugging
    sourcemap: false,
    // Minimizar el código para producción
    minify: "oxc",
  },
  plugins: [
    // Generar archivos de definición de tipos (.d.ts) automáticamente
    dts({
      rollupTypes: true,
      insertTypesEntry: true,
      include: ['src/**/*.ts'],
      outDir: 'dist/types',
    }),
  ],
});
