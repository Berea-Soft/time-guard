/**
 * Punto de entrada público del módulo Playground.
 * Construye proyectos para los 7 frameworks soportados y los abre/embebe en
 * CodeSandbox mediante sandpack-client (o la API de CodeSandbox).
 */

import { loadSandpackClient } from '@codesandbox/sandpack-client';
import type { SandpackClient } from '@codesandbox/sandpack-client';
import { compressToBase64 } from 'lz-string';
import type {
  BuildOptions,
  Framework,
  PlaygroundMode,
  PlaygroundProject,
} from './types';
import {
  FRAMEWORKS,
  TIME_GUARD_VERSION,
  sandpackTemplateFor,
  toSandpackFiles,
} from './types';
import { buildVanillaRunner, buildVanillaApp } from './templates/vanilla';
import { buildVueRunner, buildVueApp } from './templates/vue';
import { buildReactRunner, buildReactApp } from './templates/react';
import { buildSvelteRunner, buildSvelteApp } from './templates/svelte';
import { buildAngularRunner, buildAngularApp } from './templates/angular';
import { buildSolidRunner, buildSolidApp } from './templates/solid';
import { buildQwikRunner, buildQwikApp } from './templates/qwik';

export { FRAMEWORKS, TIME_GUARD_VERSION, sandpackTemplateFor, toSandpackFiles };
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
 * Construye un proyecto CodeSandbox para el framework solicitado.
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

/** Abre el proyecto en una pestaña nueva de CodeSandbox usando la API define con LZ64. */
export function openInCodeSandbox(
  framework: Framework,
  mode: PlaygroundMode,
  opts: BuildOptions,
): void {
  const project = buildProject(framework, mode, opts);

  const parameters = compressToBase64(
    JSON.stringify({
      files: Object.fromEntries(
        Object.entries(project.files).map(([path, content]) => [
          path,
          { content },
        ]),
      ),
    }),
  );

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://codesandbox.io/api/v1/sandboxes/define';
  form.target = '_blank';

  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'parameters';
  input.value = parameters;
  form.appendChild(input);

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

export interface EmbedOptions {
  /** Altura del iframe en píxeles. Default 540. */
  height?: number;
}

/**
 * Crea un sandbox inline usando sandpack-client.
 * Usa `SandpackRuntime` (bundler en navegador) con el template adecuado
 * para cada framework.
 *
 * Nota: el bundler de CodeSandbox pasa por Cloudflare. En localhost
 * puede mostrar un challenge de seguridad. En producción (dominio real)
 * funciona sin problemas.
 */
export async function embedInCodeSandbox(
  iframe: HTMLIFrameElement,
  framework: Framework,
  mode: PlaygroundMode,
  opts: BuildOptions,
  _embedOpts: EmbedOptions = {},
): Promise<SandpackClient> {
  const project = buildProject(framework, mode, opts);

  const client = await loadSandpackClient(
    iframe,
    {
      files: toSandpackFiles(project.files),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      template: sandpackTemplateFor(framework) as any,
    },
    {
      bundlerURL: 'https://sandpack-bundler.codesandbox.io',
      height: `${_embedOpts.height ?? 540}`,
      showErrorScreen: true,
      showLoadingScreen: true,
      showOpenInCodeSandbox: false,
    },
  );

  return client;
}
