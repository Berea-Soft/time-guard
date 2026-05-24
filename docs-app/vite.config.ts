// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import VueDevTools from 'vite-plugin-vue-devtools';
import { fileURLToPath, URL } from 'node:url';
import { resolve } from 'path';
import { readFileSync } from 'fs';

const rootPkg = JSON.parse(
  readFileSync(resolve(__dirname, '../package.json'), 'utf-8'),
);

export default defineConfig({
  appType: 'spa',
  define: {
    __VERSION__: JSON.stringify(rootPkg.version),
  },
  plugins: [
    VueDevTools(),
    vue(),
    tailwindcss(),
    {
      name: 'spa-fallback',
      configurePreviewServer(server) {
        server.middlewares.use((req, _res, next) => {
          const url = req.url ?? '/';
          if (!url.startsWith('/') || url === '/') return next();
          if (/\.[a-z0-9]+$/i.test(url)) return next();
          req.url = '/index.html';
          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@bereasoftware/time-guard': resolve(__dirname, '../src'),
    },
  },
});
