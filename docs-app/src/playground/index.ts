/**
 * Punto de entrada público del módulo Playground.
 * Construye proyectos para los 7 frameworks soportados y los abre/embebe en
 * StackBlitz (WebContainers) — corre 100% en el navegador del usuario, sin
 * depender de un bundler externo con subdominios por-sandbox (a diferencia
 * de CodeSandbox/Sandpack, cuyo relay quedaba bloqueado por Cloudflare en
 * localhost).
 */

import sdk from '@stackblitz/sdk';
import type { VM } from '@stackblitz/sdk';
import type {
  BuildOptions,
  Framework,
  PlaygroundMode,
  PlaygroundProject,
} from './types';
import { FRAMEWORKS, TIME_GUARD_VERSION } from './types';
import { buildVanillaRunner, buildVanillaApp } from './templates/vanilla';
import { buildVueRunner, buildVueApp } from './templates/vue';
import { buildReactRunner, buildReactApp } from './templates/react';
import { buildSvelteRunner, buildSvelteApp } from './templates/svelte';
import { buildAngularRunner, buildAngularApp } from './templates/angular';
import { buildSolidRunner, buildSolidApp } from './templates/solid';
import { buildQwikRunner, buildQwikApp } from './templates/qwik';

export { FRAMEWORKS, TIME_GUARD_VERSION };
export type {
  BuildOptions,
  Framework,
  FrameworkMeta,
  PlaygroundMode,
  PlaygroundProject,
} from './types';

type Builder = (opts: BuildOptions) => PlaygroundProject;

const RUNNERS: Record<Framework, Builder> = {
  vanilla: buildVanillaRunner,
  vue: buildVueRunner,
  react: buildReactRunner,
  svelte: buildSvelteRunner,
  angular: buildAngularRunner,
  solid: buildSolidRunner,
  qwik: buildQwikRunner,
};

const APPS: Record<Framework, Builder> = {
  vanilla: buildVanillaApp,
  vue: buildVueApp,
  react: buildReactApp,
  svelte: buildSvelteApp,
  angular: buildAngularApp,
  solid: buildSolidApp,
  qwik: buildQwikApp,
};

/**
 * Construye un proyecto StackBlitz para el framework solicitado.
 *
 * - `runner`: envuelve un snippet TS genérico en un runner universal que
 *   captura `console.log` y lo muestra en pantalla en cualquier framework.
 * - `app`: trata el código como contenido directo del archivo App del
 *   framework (idiomatic). Útil para ejemplos curados por framework.
 */
export function buildProject(
  framework: Framework,
  mode: PlaygroundMode,
  opts: BuildOptions,
): PlaygroundProject {
  const builder = mode === 'app' ? APPS[framework] : RUNNERS[framework];
  return builder(opts);
}

function toStackBlitzProject(project: PlaygroundProject) {
  return {
    title: project.title,
    description: project.description ?? '',
    template: project.template,
    files: project.files,
  };
}

/** Abre el proyecto en una pestaña nueva de StackBlitz. */
export function openInStackBlitz(
  framework: Framework,
  mode: PlaygroundMode,
  opts: BuildOptions,
): void {
  const project = buildProject(framework, mode, opts);
  sdk.openProject(toStackBlitzProject(project), {
    openFile: project.openFile,
    newWindow: true,
  });
}

export interface EmbedOptions {
  /** Altura del embed en píxeles. Default 540. */
  height?: number;
}

/**
 * Crea un sandbox inline usando el SDK de StackBlitz (WebContainers).
 * El SDK inyecta su propio iframe dentro de `container` y ejecuta
 * `npm install` + el script `dev` del `package.json` generado, enteramente
 * en el navegador — no depende de un bundler externo por-sandbox.
 */
export async function embedInStackBlitz(
  container: HTMLElement,
  framework: Framework,
  mode: PlaygroundMode,
  opts: BuildOptions,
  embedOpts: EmbedOptions = {},
): Promise<VM> {
  const project = buildProject(framework, mode, opts);

  return sdk.embedProject(container, toStackBlitzProject(project), {
    height: embedOpts.height ?? 540,
    openFile: project.openFile,
    // 'default' shows editor + preview side by side ("both"); StackBlitz
    // has no explicit 'both' value — omitting `view`/using 'default' is it.
    view: 'default',
    hideNavigation: true,
    hideDevTools: true,
    theme: 'dark',
    clickToLoad: false,
    // Our own server sends COOP/COEP (see vite.config.ts / vercel.json), so
    // the embed can run cross-origin-isolated instead of falling back to
    // (or failing with) the non-isolated WebContainers path.
    crossOriginIsolated: true,
  });
}
