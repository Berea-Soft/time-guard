import type { BuildOptions, PlaygroundProject } from '../types';
import { TIME_GUARD_VERSION } from '../types';
import { buildSnippetModule, getRunnerUtils } from '../snippet';

const mainTs = `import 'zone.js';
import { Component, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div style="padding: 20px">
      <h1 style="font-size: 18px; color: #dd0031">TimeGuard · Angular</h1>
      <pre *ngIf="!error">{{ output.length ? output.join('\\\\n') : '(no output)' }}</pre>
      <pre *ngIf="error" style="color: #ef4444">[Error] {{ error }}</pre>
    </div>
  \`,
})
export class App implements OnInit {
  output = [];
  error = null;
  async ngOnInit() {
    try {
      await import('./snippet');
      const { output: logs } = await import('./runner-utils');
      this.output = logs;
    } catch (err) {
      this.error = err.message;
    }
  }
}

bootstrapApplication(App);`;

export function buildAngularRunner(opts: BuildOptions): PlaygroundProject {
  return {
    template: 'node',
    title: opts.title ?? 'TimeGuard · Angular',
    files: {
      'package.json': JSON.stringify(
        {
          name: 'tg-angular',
          type: 'module',
          scripts: { dev: 'vite' },
          dependencies: {
            '@bereasoftware/time-guard': opts.version ?? TIME_GUARD_VERSION,
            '@angular/common': 'latest',
            '@angular/compiler': 'latest',
            '@angular/core': 'latest',
            '@angular/platform-browser': 'latest',
            rxjs: 'latest',
            'zone.js': 'latest',
          },
          devDependencies: {
            vite: '^6.3.0',
            '@analogjs/vite-plugin-angular': '^1.19.1',
            typescript: 'latest',
          },
        },
        null,
        2,
      ),
      'tsconfig.json': `{"compilerOptions": {"target": "ESNext", "module": "ESNext", "moduleResolution": "Bundler", "strict": true, "experimentalDecorators": true, "lib": ["ESNext", "DOM"]}}`,
      'vite.config.js': `import angular from '@analogjs/vite-plugin-angular'; export default { plugins: [angular()], server: { host: true } };`,
      'index.html': `<!doctype html><html><head><style>body { font-family: monospace; background: #0f172a; color: #e2e8f0; } pre { background: #1e293b; padding: 16px; border-radius: 8px; }</style></head><body><app-root></app-root><script type="module" src="/src/main.ts"></script></body></html>`,
      'src/main.ts': mainTs,
      'src/runner-utils.ts': getRunnerUtils(),
      'src/snippet.ts': buildSnippetModule(opts.code),
    },
    openFile: 'src/snippet.ts',
  };
}

export function buildAngularApp(opts: BuildOptions): PlaygroundProject {
  return {
    template: 'node',
    title: opts.title ?? 'TimeGuard · Angular App',
    files: {
      'package.json': JSON.stringify(
        {
          name: 'tg-angular-app',
          type: 'module',
          scripts: { dev: 'vite' },
          dependencies: {
            '@bereasoftware/time-guard': opts.version ?? TIME_GUARD_VERSION,
            '@angular/common': 'latest',
            '@angular/compiler': 'latest',
            '@angular/core': 'latest',
            '@angular/platform-browser': 'latest',
            rxjs: 'latest',
            'zone.js': 'latest',
          },
          devDependencies: {
            vite: '^6.3.0',
            '@analogjs/vite-plugin-angular': '^1.19.1',
            typescript: 'latest',
          },
        },
        null,
        2,
      ),
      'tsconfig.json': `{"compilerOptions": {"target": "ESNext", "module": "ESNext", "moduleResolution": "Bundler", "strict": true, "experimentalDecorators": true, "lib": ["ESNext", "DOM"]}}`,
      'vite.config.js': `import angular from '@analogjs/vite-plugin-angular'; export default { plugins: [angular()], server: { host: true } };`,
      'index.html': `<!doctype html><html><body><app-root></app-root><script type="module" src="/src/main.ts"></script></body></html>`,
      'src/main.ts': `import 'zone.js'; import { bootstrapApplication } from '@angular/platform-browser'; import { AppComponent } from './app.component'; bootstrapApplication(AppComponent);`,
      'src/app.component.ts': opts.code,
    },
    openFile: 'src/app.component.ts',
  };
}
