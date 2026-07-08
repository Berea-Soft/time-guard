import type { BuildOptions, PlaygroundProject } from '../types';
import { TIME_GUARD_VERSION } from '../types';
import { buildSnippetModule, getRunnerUtils } from '../snippet';

const mainTs = `import { createApp, h, ref, onMounted } from 'vue';

const App = {
  setup() {
    const output = ref([]);
    const error = ref(null);

    onMounted(async () => {
      try {
        await import('./snippet');
        const { output: logs } = await import('./runner-utils');
        output.value = logs;
      } catch (err) {
        error.value = err.message;
      }
    });

    return () => h('div', [
      h('h1', { style: 'font-size: 18px; color: #42b883' }, 'TimeGuard · Vue'),
      error.value 
        ? h('pre', { style: 'color: #ef4444' }, '[Error] ' + error.value)
        : h('pre', output.value.length ? output.value.join('\\n') : '(no output)')
    ]);
  }
};

createApp(App).mount('#app');`;

export function buildVueRunner(opts: BuildOptions): PlaygroundProject {
  return {
    template: 'node',
    title: opts.title ?? 'TimeGuard · Vue',
    files: {
      'package.json': JSON.stringify(
        {
          name: 'tg-vue',
          type: 'module',
          scripts: { dev: 'vite' },
          dependencies: {
            '@bereasoftware/time-guard': opts.version ?? TIME_GUARD_VERSION,
            vue: 'latest',
          },
          devDependencies: { vite: '^6.3.0', '@vitejs/plugin-vue': '^5.2.1' },
        },
        null,
        2,
      ),
      'tsconfig.json': `{"compilerOptions": {"target": "ESNext", "module": "ESNext", "moduleResolution": "Bundler", "strict": true, "jsx": "preserve", "lib": ["ESNext", "DOM"]}}`,
      'vite.config.js': `import vue from '@vitejs/plugin-vue'; export default { plugins: [vue()], server: { host: true } };`,
      'index.html': `<!doctype html><html><head><style>body { font-family: monospace; background: #0f172a; color: #e2e8f0; padding: 20px; } pre { background: #1e293b; padding: 16px; border-radius: 8px; }</style></head><body><div id="app"></div><script type="module" src="/src/main.ts"></script></body></html>`,
      'src/main.ts': mainTs,
      'src/runner-utils.ts': getRunnerUtils(),
      'src/snippet.ts': buildSnippetModule(opts.code),
    },
    openFile: 'src/snippet.ts',
  };
}

export function buildVueApp(opts: BuildOptions): PlaygroundProject {
  return {
    template: 'node',
    title: opts.title ?? 'TimeGuard · Vue App',
    files: {
      'package.json': JSON.stringify(
        {
          name: 'tg-vue-app',
          type: 'module',
          scripts: { dev: 'vite' },
          dependencies: {
            '@bereasoftware/time-guard': opts.version ?? TIME_GUARD_VERSION,
            vue: 'latest',
          },
          devDependencies: {
            vite: '^6.3.0',
            '@vitejs/plugin-vue': '^5.2.1',
            // Tailwind v3 (pure JS/PostCSS, no native/WASM engine) —
            // several demos (Locales/Calendars/Plugins/TimeRange/
            // BusinessDay) use Tailwind utility classes with no custom
            // <style> block. v4's Vite plugin was tried first but its
            // oxide engine hung indefinitely inside StackBlitz's
            // WebContainers (confirmed live: "npm run dev" never printed
            // "ready" after 70s+) — v3's classic PostCSS pipeline is the
            // well-proven path here.
            tailwindcss: '^3.4.0',
            postcss: '^8.4.0',
            autoprefixer: '^10.4.0',
          },
        },
        null,
        2,
      ),
      'tsconfig.json': `{"compilerOptions": {"target": "ESNext", "module": "ESNext", "moduleResolution": "Bundler", "strict": true, "jsx": "preserve", "lib": ["ESNext", "DOM"]}}`,
      'vite.config.js': `import vue from '@vitejs/plugin-vue'; export default { plugins: [vue()], server: { host: true } };`,
      // package.json above has "type": "module" — these must be ESM
      // (`export default`), not CommonJS `module.exports`, or PostCSS
      // throws "module is not defined in ES module scope".
      // darkMode 'class' + a light-mode body (bg-slate-50/text-slate-900)
      // matches docs-app's own convention exactly (see src/assets/main.css)
      // — these demos are light-mode-first with `dark:` as an opt-in
      // enhancement, not the reverse. Forcing a dark body text color here
      // while cards stayed `bg-white` (since no `.dark` class is ever
      // present to trigger the `dark:` variants) made text unreadable.
      'tailwind.config.js': `export default { content: ['./index.html', './src/**/*.{vue,js,ts}'], darkMode: 'class', theme: { extend: {} }, plugins: [] };`,
      'postcss.config.js': `export default { plugins: { tailwindcss: {}, autoprefixer: {} } };`,
      'index.html': `<!doctype html><html><body class="bg-slate-50 text-slate-900 p-6"><div id="app"></div><script type="module" src="/src/main.ts"></script></body></html>`,
      'src/style.css': `@tailwind base;\n@tailwind components;\n@tailwind utilities;`,
      'src/main.ts': `import './style.css'; import { createApp } from 'vue'; import App from './App.vue'; createApp(App).mount('#app');`,
      'src/App.vue': opts.code,
    },
    openFile: 'src/App.vue',
  };
}
