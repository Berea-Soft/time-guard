import type { BuildOptions, PlaygroundProject } from '../types';
import { TIME_GUARD_VERSION } from '../types';
import { buildSnippetModule, getRunnerUtils } from '../snippet';

const indexHtml = `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>TimeGuard · Vanilla</title>
    <style>
      body { font-family: 'Fira Code', monospace; background: #0f172a; color: #e2e8f0; padding: 20px; margin: 0; }
      pre { white-space: pre-wrap; word-break: break-word; line-height: 1.6; font-size: 13px; background: #1e293b; padding: 16px; border-radius: 8px; border: 1px solid #334155; }
    </style>
  </head>
  <body>
    <pre id="app">Cargando...</pre>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`;

const tsconfig = `{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "lib": ["ESNext", "DOM"]
  }
}`;

const viteConfig = `export default {
  server: { host: true }
};`;

const mainTs = `(async () => {
  const root = document.getElementById('app');
  try {
    await import('./snippet');
    const { output } = await import('./runner-utils');
    if (root) root.textContent = output.length ? output.join('\\n') : '(no output)';
  } catch (err) {
    if (root) root.textContent = '[Error] ' + err.message;
  }
})();`;

export function buildVanillaRunner(opts: BuildOptions): PlaygroundProject {
  return {
    template: 'node',
    title: opts.title ?? 'TimeGuard · Vanilla',
    files: {
      'package.json': JSON.stringify(
        {
          name: 'tg-vanilla',
          type: 'module',
          scripts: { dev: 'vite' },
          dependencies: {
            '@bereasoftware/time-guard': opts.version ?? TIME_GUARD_VERSION,
          },
          devDependencies: { vite: 'latest', typescript: 'latest' },
        },
        null,
        2,
      ),
      'tsconfig.json': tsconfig,
      'vite.config.js': viteConfig,
      'index.html': indexHtml,
      'src/main.ts': mainTs,
      'src/runner-utils.ts': getRunnerUtils(),
      'src/snippet.ts': buildSnippetModule(opts.code),
    },
    openFile: 'src/snippet.ts',
  };
}

export function buildVanillaApp(opts: BuildOptions): PlaygroundProject {
  return {
    template: 'node',
    title: opts.title ?? 'TimeGuard · Vanilla App',
    files: {
      'package.json': JSON.stringify(
        {
          name: 'tg-vanilla-app',
          type: 'module',
          scripts: { dev: 'vite' },
          dependencies: {
            '@bereasoftware/time-guard': opts.version ?? TIME_GUARD_VERSION,
          },
          devDependencies: { vite: 'latest', typescript: 'latest' },
        },
        null,
        2,
      ),
      'tsconfig.json': tsconfig,
      'vite.config.js': viteConfig,
      'index.html': `<!doctype html><html><body><div id="app"></div><script type="module" src="/src/main.ts"></script></body></html>`,
      'src/main.ts': opts.code,
    },
    openFile: 'src/main.ts',
  };
}
