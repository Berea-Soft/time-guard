import type { BuildOptions, PlaygroundProject } from '../types';
import { TIME_GUARD_VERSION } from '../types';
import { buildSnippetModule, getRunnerUtils } from '../snippet';

const mainTsx = `import { component$, useSignal, useVisibleTask$, render } from '@builder.io/qwik';

const App = component$(() => {
  const output = useSignal([]);
  const error = useSignal(null);

  useVisibleTask$(async () => {
    try {
      await import('./snippet');
      const { output: logs } = await import('./runner-utils');
      output.value = logs;
    } catch (err) {
      error.value = err.message;
    }
  });

  return (
    <div style="padding: 20px">
      <h1 style="font-size: 18px; color: #ac7ef4">TimeGuard · Qwik</h1>
      {error.value 
        ? <pre style="color: #ef4444">[Error] {error.value}</pre>
        : <pre>{output.value.length ? output.value.join('\\n') : '(no output)'}</pre>
      }
    </div>
  );
});

render(document.getElementById('root'), <App />);`;

export function buildQwikRunner(opts: BuildOptions): PlaygroundProject {
  return {
    template: 'node',
    title: opts.title ?? 'TimeGuard · Qwik',
    files: {
      'package.json': JSON.stringify(
        {
          name: 'tg-qwik',
          type: 'module',
          scripts: { dev: 'vite' },
          dependencies: {
            '@bereasoftware/time-guard': opts.version ?? TIME_GUARD_VERSION,
            '@builder.io/qwik': 'latest',
          },
          devDependencies: { vite: '^6.3.0' },
        },
        null,
        2,
      ),
      'tsconfig.json': `{"compilerOptions": {"target": "ESNext", "module": "ESNext", "moduleResolution": "Bundler", "strict": true, "jsx": "react-jsx", "jsxImportSource": "@builder.io/qwik", "lib": ["ESNext", "DOM"]}}`,
      'vite.config.js': `import { qwikVite } from '@builder.io/qwik/optimizer'; export default { plugins: [qwikVite({ csr: true })], server: { host: true } };`,
      'index.html': `<!doctype html><html><head><style>body { font-family: monospace; background: #0f172a; color: #e2e8f0; } pre { background: #1e293b; padding: 16px; border-radius: 8px; }</style></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`,
      'src/main.tsx': mainTsx,
      'src/runner-utils.ts': getRunnerUtils(),
      'src/snippet.ts': buildSnippetModule(opts.code),
    },
    openFile: 'src/snippet.ts',
  };
}

export function buildQwikApp(opts: BuildOptions): PlaygroundProject {
  return {
    template: 'node',
    title: opts.title ?? 'TimeGuard · Qwik App',
    files: {
      'package.json': JSON.stringify(
        {
          name: 'tg-qwik-app',
          type: 'module',
          scripts: { dev: 'vite' },
          dependencies: {
            '@bereasoftware/time-guard': opts.version ?? TIME_GUARD_VERSION,
            '@builder.io/qwik': 'latest',
          },
          devDependencies: { vite: '^6.3.0' },
        },
        null,
        2,
      ),
      'tsconfig.json': `{"compilerOptions": {"target": "ESNext", "module": "ESNext", "moduleResolution": "Bundler", "strict": true, "jsx": "react-jsx", "jsxImportSource": "@builder.io/qwik", "lib": ["ESNext", "DOM"]}}`,
      'vite.config.js': `import { qwikVite } from '@builder.io/qwik/optimizer'; export default { plugins: [qwikVite({ csr: true })], server: { host: true } };`,
      'index.html': `<!doctype html><html><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`,
      'src/main.tsx': `import { render } from '@builder.io/qwik'; import App from './App'; const root = document.getElementById('root'); if (root) render(root, <App />);`,
      'src/App.tsx': opts.code,
    },
    openFile: 'src/App.tsx',
  };
}
