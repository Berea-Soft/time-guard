import type { Framework, PlaygroundMode } from '@/playground';

export interface CodeExample {
  title: string;
  description: string;
  code: string;
}

export interface PlaygroundConfig {
  /** Activa el bloque "Playground CodeSandbox". */
  enabled: boolean;
  /**
   * - `runner`: el código (genérico TS) se envuelve en un runner universal y
   *   puede probarse en cualquiera de los frameworks soportados.
   * - `app`: el código ES el contenido del archivo App del framework
   *   especificado. Solo se muestra ese framework.
   */
  mode?: PlaygroundMode;
  /** Índice del ejemplo cuyo código se inyectará (default: 0). */
  exampleIndex?: number;
  /** Frameworks habilitados (solo para `mode: 'runner'`). */
  frameworks?: Framework[];
  /** Framework forzado (obligatorio en `mode: 'app'`). */
  framework?: Framework;
}

export interface DocItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  features?: string[];
  examples: CodeExample[];
  /** Configuración opcional del playground CodeSandbox. */
  playground?: PlaygroundConfig;
  /** ID del componente demo interactivo a renderizar (opcional). */
  demoComponentId?: string;
}

export interface DocCategory {
  id: string;
  title: string;
  iconName: string;
  items: DocItem[];
}
