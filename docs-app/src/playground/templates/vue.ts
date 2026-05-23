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
          devDependencies: { vite: 'latest', '@vitejs/plugin-vue': 'latest' },
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
          devDependencies: { vite: 'latest', '@vitejs/plugin-vue': 'latest' },
        },
        null,
        2,
      ),
      'tsconfig.json': `{"compilerOptions": {"target": "ESNext", "module": "ESNext", "moduleResolution": "Bundler", "strict": true, "jsx": "preserve", "lib": ["ESNext", "DOM"]}}`,
      'vite.config.js': `import vue from '@vitejs/plugin-vue'; export default { plugins: [vue()], server: { host: true } };`,
      'index.html': `<!doctype html><html><body><div id="app"></div><script type="module" src="/src/main.ts"></script></body></html>`,
      'src/main.ts': `import { createApp } from 'vue'; import App from './App.vue'; createApp(App).mount('#app');`,
      'src/App.vue': opts.code,
    },
    openFile: 'src/App.vue',
  };
}
