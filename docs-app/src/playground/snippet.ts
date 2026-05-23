/**
 * Utilidades para procesar snippets de TypeScript que serán inyectados en
 * sandboxes de CodeSandbox. Separa imports de top-level del cuerpo ejecutable y
 * redirige `console.log` a un logger universal que persiste su salida.
 *
 * ## Flujo del runner:
 * 1. `processSnippet(code)` separa imports del cuerpo ejecutable.
 * 2. `buildDemoModule(code)` genera el módulo `demo.ts` que importa el logger.
 * 3. `getRunnerUtils()` genera el módulo `runner-utils.ts` con la lógica de captura.
 * 4. El runner de cada framework imprime `output.join('\n')` en un `<pre>`.
 */

export interface ProcessedSnippet {
  imports: string;
  body: string;
}

const IMPORT_LINE_RE = /^\s*import\b/;

/**
 * Separa imports de top-level del resto del código.
 */
export function processSnippet(code: string): ProcessedSnippet {
  const normalized = code.replace(/\r\n/g, '\n');
  const lines = normalized.split('\n');
  const imports: string[] = [];
  const body: string[] = [];
  let buffer = '';
  let inImport = false;

  for (const line of lines) {
    if (inImport) {
      buffer += '\n' + line;
      // Cierre del import multi-línea
      if (
        /from\s+['"][^'"]+['"]\s*;?\s*$/.test(line) ||
        /['"]\s*;?\s*$/.test(line.trim())
      ) {
        imports.push(buffer);
        buffer = '';
        inImport = false;
      }
      continue;
    }
    if (IMPORT_LINE_RE.test(line)) {
      // Single-line import (con o sin punto y coma final)
      if (/from\s+['"][^'"]+['"]\s*;?\s*$/.test(line)) {
        imports.push(line);
      } else {
        inImport = true;
        buffer = line;
      }
      continue;
    }
    body.push(line);
  }

  if (buffer) {
    imports.push(buffer);
  }

  return {
    imports: imports.join('\n').trim(),
    body: body.join('\n'),
  };
}

/**
 * Garantiza que `TimeGuard` esté importado del paquete principal.
 * No duplica el import si el snippet ya lo tiene.
 */
function ensureTimeGuardImport(imports: string): string {
  const hasNamedTG =
    /import\s*\{[^}]*\bTimeGuard\b[^}]*\}\s*from\s*['"]@bereasoftware\/time-guard['"]/.test(
      imports,
    );
  if (hasNamedTG) {
    return imports;
  }
  const inject = "import { TimeGuard } from '@bereasoftware/time-guard';";
  return imports ? `${inject}\n${imports}` : inject;
}

/**
 * Genera el módulo `snippet.ts` que ejecuta el código del usuario.
 * Usa shadowing de `console` para redirigir logs al runner sin alterar el código original.
 */
export function buildSnippetModule(code: string): string {
  const { imports, body } = processSnippet(code);
  const finalImports = ensureTimeGuardImport(imports);
  const indentedBody = body
    .split('\n')
    .map((l) => (l.length ? '  ' + l : l))
    .join('\n');

  return `${finalImports}
import { __log } from './runner-utils';

/**
 * Redirigimos console.log a nuestro capturador para mostrarlo en el playground.
 * Esto mantiene tu código limpio y legible.
 */
const console = {
  log: __log,
  error: __log,
  warn: __log,
  info: __log,
};

// Evita tree-shaking si no se usa explícitamente.
void TimeGuard;

try {
${indentedBody}
} catch (err) {
  console.error('[Error] ' + (err instanceof Error ? err.message : String(err)));
}
`;
}

/**
 * Genera el código para `runner-utils.ts`.
 * Contiene el estado compartido de los logs y funciones de formateo.
 */
export function getRunnerUtils(): string {
  return `const __lines: string[] = [];

function __fmt(v: unknown): string {
  if (v === undefined) return 'undefined';
  if (v === null) return 'null';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (v instanceof Date) return v.toISOString();
  try {
    // Manejo básico de objetos para evitar circularidad en JSON.stringify si fuera necesario,
    // pero para demos simples esto es suficiente.
    return JSON.stringify(v, null, 2);
  } catch (err) {
    return String(v);
  }
}

export function __log(...args: unknown[]): void {
  __lines.push(args.map(__fmt).join(' '));
}

export const output = __lines;
export default output;
`;
}
