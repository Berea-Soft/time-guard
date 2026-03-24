/**
 *
 * Three build modes (run sequentially via npm run build):
 *
 *   vite build                → core + submodules (ES + CJS) + types
 *   vite build --mode full    → full bundle (ES + CJS), self-contained
 *   vite build --mode umd     → core only (UMD + IIFE) for CDN / <script>
 *
 * Separating "full" from the main build prevents Rollup from creating
 * shared chunks (the cause of locales.esm / locales2.cjs artifacts).
 */
import { defineConfig, type UserConfig } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { readFileSync } from "fs";
import dts from "vite-plugin-dts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pack = JSON.parse(
  readFileSync(resolve(__dirname, "package.json"), "utf-8"),
);

const banner = `/*! time-guard v${
  pack.version
} | (c) ${new Date().getFullYear()} Berea-Soft | MIT License | https://github.com/Berea-Soft/time-guard */`;

/**
 * Naming convention:  ESM → <entry>.es.js  |  CJS → <entry>.cjs
 */
const fileName = (format: string, entryName: string) =>
  format === "cjs" ? `${entryName}.cjs` : `${entryName}.${format}.js`;

export default defineConfig(({ mode }): UserConfig => {
  const shared = {
    define: { __VERSION__: JSON.stringify(pack.version) },
  };

  // ── UMD / IIFE (core only, for CDN / <script>) ───────────────
  if (mode === "umd") {
    return {
      ...shared,
      build: {
        lib: {
          entry: resolve(__dirname, "src/index.ts"),
          name: "BereasoftTimeGuard",
          fileName: (format: string) =>
            format === "cjs" ? "time-guard.cjs" : `time-guard.${format}.js`,
          formats: ["umd", "iife"],
        },
        rollupOptions: {
          external: ["@js-temporal/polyfill"],
          output: {
            banner,
            exports: "named" as const,
            globals: { "@js-temporal/polyfill": "temporal" },
          },
        },
        emptyOutDir: false,
        sourcemap: false,
        minify: "oxc",
        reportCompressedSize: true,
      },
    };
  }

  // ── Full bundle (standalone, all-inclusive entry) ─────────────
  if (mode === "full") {
    return {
      ...shared,
      build: {
        lib: {
          entry: { full: resolve(__dirname, "src/full.ts") },
          fileName,
          formats: ["es", "cjs"],
        },
        rollupOptions: {
          external: ["@js-temporal/polyfill"],
          output: {
            banner,
            exports: "named" as const,
            globals: { "@js-temporal/polyfill": "temporal" },
          },
        },
        emptyOutDir: false,
        sourcemap: false,
        minify: "oxc",
        reportCompressedSize: true,
      },
      plugins: [
        dts({
          rollupTypes: true,
          tsconfigPath: resolve(__dirname, "tsconfig.json"),
          outDir: "dist/types",
        }),
      ],
    };
  }

  // ── Default: core + on-demand submodules (ES + CJS) + types ──
  return {
    ...shared,
    build: {
      lib: {
        entry: {
          "time-guard": resolve(__dirname, "src/index.ts"),
          "locales/index": resolve(__dirname, "src/locales/index.ts"),
          "calendars/index": resolve(__dirname, "src/calendars/index.ts"),
          "plugins/relative-time": resolve(
            __dirname,
            "src/plugins/relative-time/index.ts",
          ),
          "plugins/duration": resolve(
            __dirname,
            "src/plugins/duration/index.ts",
          ),
          "plugins/advanced-format": resolve(
            __dirname,
            "src/plugins/advanced-format/index.ts",
          ),
        },
        fileName,
        formats: ["es", "cjs"],
      },
      rollupOptions: {
        external: ["@js-temporal/polyfill"],
        output: {
          banner,
          exports: "named" as const,
          globals: { "@js-temporal/polyfill": "temporal" },
        },
      },
      emptyOutDir: true,
      sourcemap: false,
      minify: "oxc",
      reportCompressedSize: true,
    },
  };
});
