import type { BuildOptions, PlaygroundProject } from '../types';
import { TIME_GUARD_VERSION } from '../types';
import { buildSnippetModule, getRunnerUtils } from '../snippet';

const mainTsx = `import { render } from 'solid-js/web';
import { createSignal, onMount } from 'solid-js';

function App() {
  const [output, setOutput] = createSignal([]);
  const [error, setError] = createSignal(null);

  onMount(async () => {
    try {
      await import('./snippet');
      const { output: logs } = await import('./runner-utils');
      setOutput(logs);
    } catch (err) {
      setError(err.message);
    }
  });

  return (
    <div style="padding: 20px">
      <h1 style="font-size: 18px; color: #2c4f7c">TimeGuard · Solid</h1>
      {error() 
        ? <pre style="color: #ef4444">[Error] {error()}</pre>
        : <pre>{output().length ? output().join('\\n') : '(no output)'}</pre>
      }
    </div>
  );
}

const root = document.getElementById('root');
if (root) render(() => <App />, root);`;

export function buildSolidRunner(opts: BuildOptions): PlaygroundProject {
  return {
    template: 'node',
    title: opts.title ?? 'TimeGuard · Solid',
    files: {
      'package.json': JSON.stringify(
        {
          name: 'tg-solid',
          type: 'module',
          scripts: { dev: 'vite' },
          dependencies: {
            '@bereasoftware/time-guard': opts.version ?? TIME_GUARD_VERSION,
            'solid-js': 'latest',
          },
          devDependencies: { vite: '^6.3.0', 'vite-plugin-solid': '^2.11.6' },
        },
        null,
        2,
      ),
      'tsconfig.json': `{"compilerOptions": {"target": "ESNext", "module": "ESNext", "moduleResolution": "Bundler", "strict": true, "jsx": "preserve", "jsxImportSource": "solid-js", "lib": ["ESNext", "DOM"]}}`,
      'vite.config.js': `import solid from 'vite-plugin-solid'; export default { plugins: [solid()], server: { host: true } };`,
      'index.html': `<!doctype html><html><head><style>body { font-family: monospace; background: #0f172a; color: #e2e8f0; } pre { background: #1e293b; padding: 16px; border-radius: 8px; }</style></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`,
      'src/main.tsx': mainTsx,
      'src/runner-utils.ts': getRunnerUtils(),
      'src/snippet.ts': buildSnippetModule(opts.code),
    },
    openFile: 'src/snippet.ts',
  };
}

export function buildSolidApp(opts: BuildOptions): PlaygroundProject {
  return {
    template: 'node',
    title: opts.title ?? 'TimeGuard · Solid App',
    files: {
      'package.json': JSON.stringify(
        {
          name: 'tg-solid-app',
          type: 'module',
          scripts: { dev: 'vite' },
          dependencies: {
            '@bereasoftware/time-guard': opts.version ?? TIME_GUARD_VERSION,
            'solid-js': 'latest',
          },
          devDependencies: { vite: '^6.3.0', 'vite-plugin-solid': '^2.11.6' },
        },
        null,
        2,
      ),
      'tsconfig.json': `{"compilerOptions": {"target": "ESNext", "module": "ESNext", "moduleResolution": "Bundler", "strict": true, "jsx": "preserve", "jsxImportSource": "solid-js", "lib": ["ESNext", "DOM"]}}`,
      'vite.config.js': `import solid from 'vite-plugin-solid'; export default { plugins: [solid()], server: { host: true } };`,
      'index.html': `<!doctype html><html><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`,
      'src/main.tsx': `import { render } from 'solid-js/web'; import App from './App'; const root = document.getElementById('root'); if (root) render(() => <App />, root);`,
      'src/App.tsx': opts.code,
    },
    openFile: 'src/App.tsx',
  };
}
