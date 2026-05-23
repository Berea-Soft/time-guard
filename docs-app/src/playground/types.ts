/**
 * Tipos para la integración CodeSandbox Playground.
 * Define los frameworks soportados y la forma de los proyectos generados.
 */

export type Framework =
  | 'vanilla'
  | 'vue'
  | 'react'
  | 'svelte'
  | 'angular'
  | 'solid'
  | 'qwik';

export type PlaygroundMode = 'runner' | 'app';

export interface FrameworkMeta {
  id: Framework;
  label: string;
  /** Color brand del framework (para UI). */
  color: string;
  /** Nombre del icono Lucide a usar. */
  iconName: string;
}

export type SandpackTemplate =
  | 'angular-cli'
  | 'create-react-app'
  | 'create-react-app-typescript'
  | 'svelte'
  | 'parcel'
  | 'vue-cli'
  | 'static'
  | 'solid'
  | 'nextjs'
  | 'node';

export interface PlaygroundProject {
  /** Plantilla para CodeSandbox. Usamos 'node' porque generamos package.json completo. */
  template: SandpackTemplate;
  title: string;
  description?: string;
  files: Record<string, string>;
  /** Archivo a abrir por defecto en el editor. */
  openFile?: string;
}

export interface BuildOptions {
  /** Código TS / framework a inyectar. */
  code: string;
  /** Título del proyecto. */
  title?: string;
  /** Descripción del proyecto. */
  description?: string;
  /** Versión semver del paquete @bereasoftware/time-guard. */
  version?: string;
}

export const FRAMEWORKS: readonly FrameworkMeta[] = [
  { id: 'vanilla', label: 'Vanilla', color: '#f7df1e', iconName: 'Code2' },
  { id: 'vue', label: 'Vue', color: '#42b883', iconName: 'Triangle' },
  { id: 'react', label: 'React', color: '#61dafb', iconName: 'Atom' },
  { id: 'svelte', label: 'Svelte', color: '#ff3e00', iconName: 'Flame' },
  { id: 'angular', label: 'Angular', color: '#dd0031', iconName: 'Shield' },
  { id: 'solid', label: 'Solid', color: '#2c4f7c', iconName: 'Snowflake' },
  { id: 'qwik', label: 'Qwik', color: '#ac7ef4', iconName: 'Zap' },
] as const;

/** Versión por defecto del paquete time-guard a instalar en los sandboxes. */
export const TIME_GUARD_VERSION = 'latest';

/**
 * Mapea cada Framework al template oficial de Sandpack.
 * Usamos 'static' para todos: es el más estable, no requiere bundler
 * en el navegador y evita errores de entorno Node.
 */
export function sandpackTemplateFor(_framework: Framework): string {
  return 'static';
}

/**
 * Convierte el formato de archivos plano (Record<string, string>) al formato
 * que espera sandpack-client (Record<string, { code: string }>).
 */
export function toSandpackFiles(
  files: Record<string, string>,
): Record<string, { code: string }> {
  return Object.fromEntries(
    Object.entries(files).map(([path, content]) => [path, { code: content }]),
  );
}
