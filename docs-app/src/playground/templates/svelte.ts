import type { BuildOptions, PlaygroundProject } from '../types';
import { TIME_GUARD_VERSION } from '../types';
import { buildSnippetModule, getRunnerUtils } from '../snippet';

const mainTs = `import { mount } from 'svelte';
import App from './App.svelte';
mount(App, { target: document.getElementById('app') });`;

const appSvelte = `<script>
  import { onMount } from 'svelte';
  let output = $state([]);
  let error = $state(null);

  onMount(async () => {
    try {
      await import('./snippet');
      const { output: logs } = await import('./runner-utils');
      output = logs;
    } catch (err) {
      error = err.message;
    }
  });
</script>

<div style="padding: 20px">
  <h1 style="font-size: 18px; color: #ff3e00">TimeGuard · Svelte</h1>
  {#if error}
    <pre style="color: #ef4444">[Error] {error}</pre>
  {:else}
    <pre>{output.length ? output.join('\\n') : '(no output)'}</pre>
  {/if}
</div>`;

export function buildSvelteRunner(opts: BuildOptions): PlaygroundProject {
  return {
    template: 'node',
    title: opts.title ?? 'TimeGuard · Svelte',
    files: {
      'package.json': JSON.stringify(
        {
          name: 'tg-svelte',
          type: 'module',
          scripts: { dev: 'vite' },
          dependencies: {
            '@bereasoftware/time-guard': opts.version ?? TIME_GUARD_VERSION,
            svelte: 'latest',
          },
          devDependencies: {
            vite: '^6.3.0',
            '@sveltejs/vite-plugin-svelte': '^4.0.0',
          },
        },
        null,
        2,
      ),
      'tsconfig.json': `{"compilerOptions": {"target": "ESNext", "module": "ESNext", "moduleResolution": "Bundler", "strict": true, "lib": ["ESNext", "DOM"]}}`,
      'vite.config.js': `import { svelte } from '@sveltejs/vite-plugin-svelte'; export default { plugins: [svelte()], server: { host: true } };`,
      'index.html': `<!doctype html><html><head><style>body { font-family: monospace; background: #0f172a; color: #e2e8f0; } pre { background: #1e293b; padding: 16px; border-radius: 8px; }</style></head><body><div id="app"></div><script type="module" src="/src/main.ts"></script></body></html>`,
      'src/main.ts': mainTs,
      'src/App.svelte': appSvelte,
      'src/runner-utils.ts': getRunnerUtils(),
      'src/snippet.ts': buildSnippetModule(opts.code),
    },
    openFile: 'src/snippet.ts',
  };
}

export function buildSvelteApp(opts: BuildOptions): PlaygroundProject {
  return {
    template: 'node',
    title: opts.title ?? 'TimeGuard · Svelte App',
    files: {
      'package.json': JSON.stringify(
        {
          name: 'tg-svelte-app',
          type: 'module',
          scripts: { dev: 'vite' },
          dependencies: {
            '@bereasoftware/time-guard': opts.version ?? TIME_GUARD_VERSION,
            svelte: 'latest',
          },
          devDependencies: {
            vite: '^6.3.0',
            '@sveltejs/vite-plugin-svelte': '^4.0.0',
          },
        },
        null,
        2,
      ),
      'tsconfig.json': `{"compilerOptions": {"target": "ESNext", "module": "ESNext", "moduleResolution": "Bundler", "strict": true, "lib": ["ESNext", "DOM"]}}`,
      'vite.config.js': `import { svelte } from '@sveltejs/vite-plugin-svelte'; export default { plugins: [svelte()], server: { host: true } };`,
      'index.html': `<!doctype html><html><body><div id="app"></div><script type="module" src="/src/main.ts"></script></body></html>`,
      'src/main.ts': `import { mount } from 'svelte'; import App from './App.svelte'; mount(App, { target: document.getElementById('app') });`,
      'src/App.svelte': opts.code,
    },
    openFile: 'src/App.svelte',
  };
}
