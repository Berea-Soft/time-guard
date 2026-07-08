import type { BuildOptions, PlaygroundProject } from '../types';
import { TIME_GUARD_VERSION } from '../types';
import { buildSnippetModule, getRunnerUtils } from '../snippet';

const mainTsx = `import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  const [output, setOutput] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        await import('./snippet');
        const { output: logs } = await import('./runner-utils');
        setOutput(logs);
      } catch (err) {
        setError(err.message);
      }
    })();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 18, color: '#61dafb' }}>TimeGuard · React</h1>
      {error 
        ? <pre style={{ color: '#ef4444' }}>[Error] {error}</pre>
        : <pre>{output.length ? output.join('\\n') : '(no output)'}</pre>
      }
    </div>
  );
}

const root = document.getElementById('root');
if (root) createRoot(root).render(<App />);`;

export function buildReactRunner(opts: BuildOptions): PlaygroundProject {
  return {
    template: 'node',
    title: opts.title ?? 'TimeGuard · React',
    files: {
      'package.json': JSON.stringify(
        {
          name: 'tg-react',
          type: 'module',
          scripts: { dev: 'vite' },
          dependencies: {
            '@bereasoftware/time-guard': opts.version ?? TIME_GUARD_VERSION,
            react: 'latest',
            'react-dom': 'latest',
          },
          devDependencies: { vite: '^6.3.0', '@vitejs/plugin-react': '^4.3.4' },
        },
        null,
        2,
      ),
      'tsconfig.json': `{"compilerOptions": {"target": "ESNext", "module": "ESNext", "moduleResolution": "Bundler", "strict": true, "jsx": "react-jsx", "lib": ["ESNext", "DOM"]}}`,
      'vite.config.js': `import react from '@vitejs/plugin-react'; export default { plugins: [react()], server: { host: true } };`,
      'index.html': `<!doctype html><html><head><style>body { font-family: monospace; background: #0f172a; color: #e2e8f0; margin: 0; } pre { background: #1e293b; padding: 16px; border-radius: 8px; }</style></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`,
      'src/main.tsx': mainTsx,
      'src/runner-utils.ts': getRunnerUtils(),
      'src/snippet.ts': buildSnippetModule(opts.code),
    },
    openFile: 'src/snippet.ts',
  };
}

export function buildReactApp(opts: BuildOptions): PlaygroundProject {
  return {
    template: 'node',
    title: opts.title ?? 'TimeGuard · React App',
    files: {
      'package.json': JSON.stringify(
        {
          name: 'tg-react-app',
          type: 'module',
          scripts: { dev: 'vite' },
          dependencies: {
            '@bereasoftware/time-guard': opts.version ?? TIME_GUARD_VERSION,
            react: 'latest',
            'react-dom': 'latest',
          },
          devDependencies: { vite: '^6.3.0', '@vitejs/plugin-react': '^4.3.4' },
        },
        null,
        2,
      ),
      'tsconfig.json': `{"compilerOptions": {"target": "ESNext", "module": "ESNext", "moduleResolution": "Bundler", "strict": true, "jsx": "react-jsx", "lib": ["ESNext", "DOM"]}}`,
      'vite.config.js': `import react from '@vitejs/plugin-react'; export default { plugins: [react()], server: { host: true } };`,
      'index.html': `<!doctype html><html><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`,
      'src/main.tsx': `import React from 'react'; import { createRoot } from 'react-dom/client'; import App from './App'; const el = document.getElementById('root'); if (el) createRoot(el).render(<App />);`,
      'src/App.tsx': opts.code,
    },
    openFile: 'src/App.tsx',
  };
}
