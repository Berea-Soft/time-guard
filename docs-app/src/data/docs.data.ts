import type { DocCategory } from '../types';

export const DOCS_DATA: DocCategory[] = [
  {
    id: 'getting-started',
    title: 'Empezando',
    iconName: 'Rocket',
    items: [
      {
        id: 'installation',
        title: 'Instalación',
        subtitle: 'Un solo paquete, cero peer dependencies obligatorias',
        description:
          'TimeGuard se instala como un único paquete. Los frameworks (React, Vue, Angular, Svelte, Solid, Qwik) son peer dependencies *opcionales* — solo se necesitan si importas el subpath correspondiente (ej. `@bereasoftware/time-guard/react`). Un proyecto sin ningún framework instala y usa la librería sin advertencias. Hay 4 formas de traer TimeGuard a tu proyecto — Node.js (npm/pnpm/yarn), navegador (CDN), TypeScript (consideraciones de configuración) y descarga directa (un solo archivo, sin bundler) — cada una en su propia página a la izquierda.',
        features: [
          'Node.js — npm/pnpm/yarn, ESM o CommonJS, cualquier entry point',
          'Navegador — <script> directo vía CDN (unpkg/jsdelivr), sin build step',
          'TypeScript — declaraciones .d.ts incluidas de fábrica, sin @types/ por separado',
          'Descarga — un solo archivo IIFE autocontenido para proyectos sin bundler',
        ],
        examples: [
          {
            title: 'Instalar y usar en 3 líneas',
            description:
              'El caso más simple: instalar, importar, formatear. Sin configuración adicional.',
            code: `// 1. Instalar
// npm install @bereasoftware/time-guard

// 2. Importar (el polyfill de Temporal se auto-instala al importar este entry point)
import { TimeGuard } from '@bereasoftware/time-guard';

// 3. Usar
const now = TimeGuard.now();
console.log(now.format('dddd, DD MMMM YYYY')); // "Wednesday, 20 May 2026"

// Los wrappers de frameworks son subpaths independientes — solo se resuelven
// (y solo requieren el framework como peer dependency) si los importas:
// import { useCurrentTime } from '@bereasoftware/time-guard/react';
// import { useCurrentTime } from '@bereasoftware/time-guard/vue';`,
          },
        ],
      },
      {
        id: 'installation-nodejs',
        title: 'Node.js',
        subtitle: 'npm, pnpm, yarn — ESM y CommonJS, cualquier entry point',
        description:
          'En Node.js, TimeGuard funciona igual de bien con `import` (ESM) que con `require` (CommonJS) — el paquete publica ambos formatos para cada entry point vía el campo `exports` de `package.json`. No hace falta configuración adicional más allá de instalar el paquete.',
        features: [
          'npm install @bereasoftware/time-guard',
          'pnpm add @bereasoftware/time-guard',
          'yarn add @bereasoftware/time-guard',
          'ESM (import) y CommonJS (require) — ambos soportados sin configuración extra',
          'Node.js 18+ recomendado (mismo mínimo que @js-temporal/polyfill)',
        ],
        examples: [
          {
            title: 'ESM vs. CommonJS',
            description: 'Misma API, dos sintaxis de import distintas.',
            code: `// ESM (import) — package.json con "type": "module", o archivos .mjs
import { TimeGuard } from '@bereasoftware/time-guard';

// CommonJS (require) — proyectos Node.js clásicos
const { TimeGuard } = require('@bereasoftware/time-guard');

// Ambos exponen la misma API:
const now = TimeGuard.now();
console.log(now.format('YYYY-MM-DD'));`,
          },
        ],
      },
      {
        id: 'installation-browser',
        title: 'Navegador',
        subtitle: 'Vía CDN, sin bundler ni paso de build',
        description:
          'Para páginas sin proceso de build, TimeGuard publica un bundle IIFE autocontenido (incluye el polyfill de Temporal) que expone todo bajo el global `BereasoftTimeGuard` — sirve directamente el archivo publicado en npm desde cualquier CDN de paquetes (unpkg, jsDelivr), sin necesidad de instalar nada.',
        features: [
          'https://unpkg.com/@bereasoftware/time-guard/dist/time-guard.iife.js',
          'https://cdn.jsdelivr.net/npm/@bereasoftware/time-guard/dist/time-guard.iife.js',
          'Expone el global BereasoftTimeGuard — BereasoftTimeGuard.TimeGuard, BereasoftTimeGuard.Duration, etc.',
          'Incluye el polyfill de Temporal — funciona en cualquier navegador moderno sin configuración adicional',
        ],
        examples: [
          {
            title: 'Uso directo con <script>',
            description:
              'Sin npm, sin bundler — solo un <script> y el global queda disponible.',
            code: `<script src="https://unpkg.com/@bereasoftware/time-guard/dist/time-guard.iife.js"></script>
<script>
  const { TimeGuard } = BereasoftTimeGuard;
  const now = TimeGuard.now();
  document.body.textContent = now.format('dddd, DD MMMM YYYY');
</script>`,
          },
        ],
      },
      {
        id: 'installation-typescript',
        title: 'TypeScript',
        subtitle:
          'Configuración de tsconfig.json para que resuelvan los subpaths',
        description:
          'Los tipos de TimeGuard se publican junto al paquete — no hace falta `@types/@bereasoftware__time-guard` ni nada por separado. El único punto de atención es `moduleResolution`: TimeGuard usa el campo `exports` de `package.json` para exponer sus subpaths (`/react`, `/vue`, `/native`, etc.), y la opción clásica `"moduleResolution": "node"` de TypeScript IGNORA ese campo por completo — solo entiende `exports` con `"bundler"`, `"node16"` o `"nodenext"`.',
        features: [
          '"moduleResolution": "bundler" — recomendado si usás Vite/esbuild/webpack (lo que usa este mismo repo)',
          '"moduleResolution": "node16" / "nodenext" — alternativa si tu proyecto compila con tsc directamente',
          '"moduleResolution": "node" (clásico) — NO resuelve los tipos de los subpaths (@bereasoftware/time-guard/react, etc.), aunque el import funcione en runtime',
          'target de ES2020 o superior recomendado (alineado con @js-temporal/polyfill)',
        ],
        examples: [
          {
            title: 'tsconfig.json mínimo recomendado',
            description:
              'La parte relevante para que los subpaths de TimeGuard resuelvan tipos correctamente.',
            code: `{
  "compilerOptions": {
    "target": "ES2020",
    "moduleResolution": "bundler",
    "module": "ESNext",
    "strict": true
  }
}`,
          },
        ],
      },
      {
        id: 'installation-download',
        title: 'Descarga',
        subtitle: 'Un solo archivo, sin bundler ni gestor de paquetes',
        description:
          'Si tu proyecto no usa npm ni un bundler, descargá el bundle IIFE directamente y serví lo como un archivo estático más — funciona igual que el uso vía CDN, pero auto-hospedado.',
        features: [
          'Descargá dist/time-guard.iife.js desde unpkg, jsDelivr, o npm pack',
          'Copiá el archivo a tu carpeta de assets estáticos',
          'Incluí lo con un <script src="/ruta/a/time-guard.iife.js"></script> local',
        ],
        examples: [
          {
            title: 'Auto-hospedado',
            description:
              'Mismo resultado que la CDN, sin depender de un servicio externo.',
            code: `<!-- Archivo servido desde tu propio dominio -->
<script src="/vendor/time-guard.iife.js"></script>
<script>
  const { TimeGuard } = BereasoftTimeGuard;
  console.log(TimeGuard.now().format('YYYY-MM-DD HH:mm:ss'));
</script>`,
          },
        ],
      },
    ],
  },
  {
    id: 'migration',
    title: 'Migración desde Otras Librerías',
    iconName: 'ArrowRightLeft',
    items: [
      {
        id: 'from-other-libraries',
        title: 'date-fns, Day.js y Luxon → TimeGuard',
        subtitle: 'Tablas de equivalencia verificadas contra la API real',
        description:
          'Si ya conoces date-fns, Day.js o Luxon, la curva de aprendizaje es corta — TimeGuard usa una API encadenable similar a Day.js/Luxon, pero inmutable y con `add()`/`subtract()` basados en objeto (`{ day: 7 }`) en vez de argumentos posicionales.',
        features: [
          'date-fns es funcional (funciones puras sobre Date) — TimeGuard es orientado a objetos y encadenable, como Day.js/Luxon',
          "Day.js: la API es casi 1:1 — la diferencia principal es add({day:7}) en vez de add(7, 'day'), y PluginManager.use() en vez de dayjs.extend()",
          'Luxon: TimeGuard.range(start, end) es el equivalente a Interval.fromDateTimes(), y .toPlainDate() a .toObject()',
          'Ver también "Instalación" para elegir entry point, y "Native Mode" si tu proyecto no necesita el polyfill de Temporal',
        ],
        examples: [
          {
            title: 'Equivalencias verificadas',
            description:
              'Cada línea fue ejecutada contra la versión actual de TimeGuard para confirmar el output.',
            code: `import { TimeGuard, timeGuard } from '@bereasoftware/time-guard';

// ── Desde date-fns ──────────────────────────────────────────
// addDays(date, 7)              →
timeGuard('2024-01-01').add({ day: 7 }).format('YYYY-MM-DD'); // "2024-01-08"
// differenceInDays(d1, d2)      →
timeGuard('2024-01-08').diff(timeGuard('2024-01-01'), 'day');  // 7
// format(date, 'yyyy-MM-dd')    →
timeGuard('2024-01-01').format('YYYY-MM-DD');                  // "2024-01-01"

// ── Desde Day.js (API casi idéntica) ────────────────────────
// dayjs().startOf('month')      →
timeGuard('2024-01-15').startOf('month').format('YYYY-MM-DD'); // "2024-01-01"
// d1.isBefore(d2)               →
timeGuard('2024-01-01').isBefore(timeGuard('2024-01-15'));     // true
// dayjs.extend(relativeTime)    →
// PluginManager.use(relativeTimePlugin, TimeGuard) — ver "Relative Time Plugin"

// ── Desde Luxon ──────────────────────────────────────────────
// Interval.fromDateTimes(s, e).toDuration().humanize() →
TimeGuard.range(timeGuard('2024-01-01'), timeGuard('2024-01-15'))
  .toDuration()
  .humanize({ locale: 'en' }); // "in 14 days"
// dt.toObject()                 →
timeGuard('2024-01-01').toPlainDate(); // { year: 2024, month: 1, day: 1, dayOfWeek: 1 }`,
          },
        ],
      },
    ],
  },
  {
    id: 'core',
    title: 'Conceptos Core',
    iconName: 'Compass',
    items: [
      {
        id: 'intro',
        title: 'Introducción a TimeGuard',
        subtitle: 'Una API moderna, inmutable y orientada a SOLID',
        description:
          'TimeGuard es una biblioteca premium de manipulación de fechas y horas basada en el estándar moderno Temporal API (TC39) y diseñada bajo estrictos principios SOLID. A diferencia de las bibliotecas tradicionales, TimeGuard garantiza inmutabilidad absoluta y tipado estricto en TypeScript sin necesidad de configuraciones redundantes.',
        features: [
          'Inmutabilidad absoluta (cada operación retorna una nueva instancia)',
          'Basado en el estándar moderno de JavaScript (Temporal API)',
          'Modularidad extrema con soporte tree-shakeable',
          'Soporte completo de TypeScript estricto de manera nativa',
        ],
        examples: [
          {
            title: 'Inicio Rápido y Manipulación',
            description:
              'Creación de fechas desde strings y manipulación de días o meses de forma inmutable.',
            code: `import { TimeGuard } from '@bereasoftware/time-guard';

// Crear instancias
const now = TimeGuard.now();
const specific = TimeGuard.from('2026-05-20');

// Manipular de forma fluida (inmutable)
const tomorrow = specific.add({ day: 1 });
const lastMonth = specific.subtract({ month: 1 });

console.log(specific.format('YYYY-MM-DD')); // "2026-05-20"
console.log(tomorrow.format('YYYY-MM-DD')); // "2026-05-21" (Nueva instancia)`,
          },
        ],
      },
      {
        id: 'accessors',
        title: 'Componentes y Accesores',
        subtitle: 'Obtén datos específicos de fecha y hora sin carga mental',
        description:
          'Accede rápidamente a componentes de fecha individuales como el año, mes, día de la semana, minutos o nanosegundos utilizando métodos semánticos limpios.',
        examples: [
          {
            title: 'Lectura de Componentes',
            description:
              'Obtención de propiedades de tiempo e información sobre años bisiestos.',
            code: `import { TimeGuard } from '@bereasoftware/time-guard';

const date = TimeGuard.from('2026-05-20T14:30:45.123');

console.log(date.year());       // 2026
console.log(date.month());      // 5 (Mayo)
console.log(date.day());        // 20
console.log(date.hour());       // 14
console.log(date.minute());     // 30
console.log(date.dayOfWeek());  // 3 (Miércoles)

// Verificar si el año es bisiesto
console.log(date.isLeapYear()); // false`,
          },
        ],
      },
      {
        id: 'query-methods',
        title: 'Métodos de Consulta',
        subtitle: 'isPast, isFuture, isToday, isBetween y más',
        description:
          'TimeGuard incluye una familia completa de métodos de consulta booleana para preguntar sobre el estado de una fecha: si está en el pasado o futuro, si es hoy, ayer o mañana, si cae en fin de semana o es feriado, y si se encuentra dentro de un rango con control de inclusividad.',
        features: [
          'isPast() / isFuture() — comparación contra el momento actual',
          'isToday() / isTomorrow() / isYesterday() — consultas de día relativo',
          'isWeekend() / isHoliday() / isBusinessDay() — calendario laboral',
          'isBetween(start, end, unit?, inclusivity?) — rangos con inclusividad configurable [), (), [], (]',
        ],
        examples: [
          {
            title: 'Consultas Booleanas',
            description:
              'Verifica el estado de una fecha con métodos semánticos legibles.',
            code: `import { TimeGuard } from '@bereasoftware/time-guard';

const date = TimeGuard.from('2026-05-20');
const now = TimeGuard.now();

console.log(date.isPast());      // true (si la fecha ya pasó)
console.log(date.isFuture());    // false
console.log(date.isToday());     // false (a menos que sea hoy)
console.log(date.isWeekend());   // false (20 May 2026 es Miércoles)

// Rango con inclusividad personalizada
const start = TimeGuard.from('2026-01-01');
const end = TimeGuard.from('2026-12-31');
console.log(date.isBetween(start, end, 'day', '[]')); // true

// Excluyendo extremos: (]
console.log(date.isBetween(start, end, 'day', '(]')); // true`,
          },
        ],
      },
      {
        id: 'tz-serialization',
        title: 'TimeZone y Serialización',
        subtitle: 'Zonas horarias, offsets y formatos de exportación',
        description:
          'TimeGuard ofrece soporte completo para zonas horarias con conversión fluida entre husos, obtención de offsets en string o nanosegundos, y múltiples formatos de serialización para interoperar con APIs, bases de datos y otros sistemas.',
        features: [
          'timezone(timezone) — conversión a otra zona horaria de forma inmutable',
          'getOffset() — offset en formato ±HH:mm o Z',
          'getOffsetNanoseconds() — offset en nanosegundos precisos',
          'getTimeZoneId() — identificador IANA de la zona actual',
          'toISOString() / toJSON() / valueOf() / unix() — múltiples formatos de salida',
        ],
        examples: [
          {
            title: 'Zonas Horarias y Serialización',
            description:
              'Conversión entre zonas horarias y exportación a distintos formatos.',
            code: `import { TimeGuard } from '@bereasoftware/time-guard';

const date = TimeGuard.from('2026-05-20T14:30:00');

// Convertir a zona horaria específica
const tokyo = date.timezone('Asia/Tokyo');
console.log(tokyo.format('YYYY-MM-DD HH:mm')); // con offset de Tokyo

// Obtener offset
console.log(tokyo.getOffset());       // "+09:00"
console.log(tokyo.getTimeZoneId());   // "Asia/Tokyo"

// Serialización
console.log(date.toISOString());      // "2026-05-20T14:30:00.000Z"
console.log(date.toJSON());           // "2026-05-20T14:30:00.000Z"
console.log(date.unix());             // 1779532200 (timestamp en segundos)
console.log(+date);                   // 1779532200000 (valueOf en ms)`,
          },
        ],
      },
      {
        id: 'setters',
        title: 'Setters y Manipulación Precisa',
        subtitle: 'withDate, withTime, set, startOf, endOf, round',
        description:
          'TimeGuard proporciona setters semánticos y operaciones de redondeo para manipular fechas con precisión quirúrgica. Desde establecer componentes individuales hasta redondear al minuto más cercano o moverte al inicio/fin de un período.',
        features: [
          'withDate(year, month, day) / withTime(hour, minute, second, ms) — setters semánticos',
          'set({ key: value }) — establece componentes arbitrarios de forma inmutable',
          'startOf(unit) / endOf(unit) — navega al inicio o fin de año, mes, día, hora, etc.',
          'round({ smallestUnit, roundingMode }) — redondeo con modos: ceil, floor, halfExpand, trunc',
        ],
        examples: [
          {
            title: 'Setters y Redondeo',
            description:
              'Establece componentes de fecha y redondea con precisión.',
            code: `import { TimeGuard } from '@bereasoftware/time-guard';

let date = TimeGuard.from('2026-05-20T14:30:45.123');

// Setters semánticos
console.log(date.withDate(2026, 12, 25).format('YYYY-MM-DD')); // 2026-12-25
console.log(date.withTime(9, 0, 0).format('HH:mm:ss'));        // 09:00:00

// startOf / endOf
console.log(date.startOf('month').format('YYYY-MM-DD'));       // 2026-05-01
console.log(date.endOf('year').format('YYYY-MM-DD'));          // 2026-12-31

// Redondeo
date = TimeGuard.from('2026-05-20T14:35:20');
const rounded = date.round({ smallestUnit: 'hour', roundingMode: 'halfExpand' });
console.log(rounded.format('HH:mm')); // 15:00 (redondea hacia arriba)`,
          },
        ],
      },
      {
        id: 'native-mode',
        title: 'Native Mode — Build sin Polyfill',
        subtitle: 'Elige el entry point según si tu entorno ya tiene Temporal',
        description:
          'TimeGuard expone dos puntos de entrada con el mismo API público: `@bereasoftware/time-guard` (incluye e instala el polyfill `@js-temporal/polyfill` automáticamente) y `@bereasoftware/time-guard/native` (asume que `globalThis.Temporal` ya existe en el entorno — Node.js/navegadores que ya implementen la propuesta TC39). El build nativo evita el peso del polyfill cuando no lo necesitas.',
        features: [
          '@bereasoftware/time-guard — instala el polyfill si `globalThis.Temporal` no existe (por defecto, máxima compatibilidad)',
          '@bereasoftware/time-guard/native — cero polyfill; lanza un error explícito si `Temporal` no está disponible en el entorno',
          'Mismo API — cambiar de entry point es un cambio de un import, no de código',
          '⚠️ Los subpaths de framework (/react, /vue, /svelte, /solid, /qwik, /angular) importan el core directamente — se comportan como /native (sin auto-instalar el polyfill), aunque los importes sin pasar por /native explícitamente',
        ],
        examples: [
          {
            title: 'Elegir el entry point',
            description:
              'Usa /native solo cuando controles el runtime (Node reciente, edge functions, o navegadores con soporte nativo de Temporal).',
            code: `// Por defecto — instala el polyfill automáticamente, funciona en cualquier entorno
import { TimeGuard } from '@bereasoftware/time-guard';

// Native mode — sin polyfill, requiere que el entorno YA tenga Temporal.
// Lanza: "Temporal API not loaded" si no está disponible.
import { TimeGuard as NativeTimeGuard } from '@bereasoftware/time-guard/native';

const date = NativeTimeGuard.from('2026-05-20');
console.log(date.format('YYYY-MM-DD')); // "2026-05-20" — sin bytes de polyfill en el bundle`,
          },
        ],
      },
      {
        id: 'error-handling',
        title: 'Manejo de Errores y Casos Límite',
        subtitle: 'Qué pasa con entradas inválidas — verificado, no supuesto',
        description:
          'TimeGuard prioriza nunca lanzar excepciones en el camino feliz, pero eso tiene una contrapartida importante: varias entradas inválidas fallan **en silencio** en vez de lanzar un error. Esta página documenta el comportamiento real (verificado ejecutándolo), no el que "debería" tener — para que sepas exactamente qué esperar antes de que te sorprenda en producción.',
        features: [
          "TimeGuard.from('texto inválido') — NO lanza; devuelve silenciosamente la fecha/hora actual (equivalente a TimeGuard.now())",
          ".timezone('Zona/Inexistente') — NO lanza; ignora la conversión y mantiene la instancia sin zona horaria (getTimeZoneId() devuelve null)",
          'No existe un método isValid() — si necesitas distinguir "fecha real" de "fallback silencioso", valida el string de entrada tú mismo antes de llamar a from()',
          'ITimeGuardConfig.strict — el flag existe en el tipo y se acepta en el constructor, pero HOY no se lee ni se aplica en ninguna validación interna (es un no-op reservado para uso futuro)',
        ],
        examples: [
          {
            title: 'Comportamiento real ante entradas inválidas',
            description:
              'Salidas verificadas — no asumidas — contra la versión actual de la librería.',
            code: `import { TimeGuard } from '@bereasoftware/time-guard';

// Un string que no es una fecha real NO lanza — cae silenciosamente a "ahora"
const garbage = TimeGuard.from('esto no es una fecha');
console.log(garbage.format('YYYY-MM-DD HH:mm:ss'));
// Imprime la fecha/hora ACTUAL al momento de ejecutar (varía cada vez) —
// no un error, no "Invalid Date". Fácil de confundir con una fecha real.

// Una zona horaria inexistente tampoco lanza — simplemente no aplica el cambio
const badTz = TimeGuard.now().timezone('Zona/Inexistente');
console.log(badTz.getTimeZoneId()); // null — sigue siendo un PlainDateTime, no ZonedDateTime

// Recomendación: si el input viene de un formulario/API externa y necesitas
// detectar el caso inválido, valida el string ANTES de pasarlo a from() —
// TimeGuard no te avisará por sí solo.`,
          },
        ],
      },
      {
        id: 'typescript-usage',
        title: 'TypeScript — Tipos y Uso',
        subtitle: 'Tipos incluidos, null-safety real, y cómo tipar tus plugins',
        description:
          'Las declaraciones `.d.ts` se publican junto al paquete — no hay que instalar `@types/` por separado. La mayoría de los tipos públicos (`ITimeGuardConfig`, `DurationParts`, `Unit`, etc.) se importan con `import type` desde el mismo entry point que usas para el valor. Varios métodos devuelven explícitamente `T | null` — vale la pena conocerlos si usas `strictNullChecks` (activado por defecto en proyectos modernos).',
        features: [
          "import type { ... } from '@bereasoftware/time-guard' — todos los tipos públicos se re-exportan desde el mismo entry point, sin subpath especial",
          'Métodos que devuelven `T | null`: `getTimeZoneId()`, `TimeRange.intersect()`, `DiffResult.breakdown()` (null salvo en modo calendar), `CalendarManager.get(id)`',
          'declare module + interface merging — la forma correcta de tipar métodos añadidos por un plugin propio (ver "Crear un Plugin Personalizado")',
          "Unit — el tipo unión usado en add()/subtract()/diff()/startOf()/endOf() ('year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond' | 'microsecond' | 'nanosecond')",
        ],
        examples: [
          {
            title: 'Importar tipos y manejar los null explícitos',
            description:
              'Los tipos viven junto al valor — no hay un subpath /types separado.',
            code: `import { TimeGuard, CalendarManager } from '@bereasoftware/time-guard';
import type { ITimeGuardConfig, Unit } from '@bereasoftware/time-guard';

const config: ITimeGuardConfig = { locale: 'es', timezone: 'America/Bogota' };
const date = TimeGuard.from('2026-05-20', config);

// getTimeZoneId() es string | null — TypeScript te obliga a manejarlo
const zoneId: string | null = date.getTimeZoneId();
console.log(zoneId ?? 'sin zona asociada');

// CalendarManager.get() también es T | null — devuelve undefined/null si el id no existe
const calendar = CalendarManager.getInstance().get('no-existe');
console.log(calendar?.name ?? 'calendario no encontrado');

// Unit es un literal union — el autocompletado de tu editor lista las 10 unidades válidas
const unit: Unit = 'day';
console.log(date.add({ [unit]: 5 }).format('YYYY-MM-DD'));`,
          },
        ],
      },
      {
        id: 'bundle-size',
        title: 'Tamaño del Bundle y Entry Points',
        subtitle: 'Qué pesa cada subpath — medido, no estimado',
        description:
          'TimeGuard se distribuye en subpaths independientes para que solo pagues por lo que usas. Todos los subpaths (salvo el entry principal) comparten un chunk `core` común — se descarga una sola vez sin importar cuántos subpaths importes. Los números de abajo son gzip real de la build actual, no estimaciones.',
        features: [
          '@bereasoftware/time-guard (default, incluye @js-temporal/polyfill) — ~52 KB gzip, autocontenido',
          '@bereasoftware/time-guard/native + chunk core compartido — ~10 KB gzip totales (cuando el entorno ya tiene Temporal global)',
          'Wrappers de framework (react/vue/svelte/solid/qwik/angular) — entre 0.5 y 1.6 KB gzip cada uno, ENCIMA del chunk core (no lo duplican)',
          'Plugins (relative-time/advanced-format/duration) — 1-1.5 KB gzip cada uno, 100% opt-in vía PluginManager.use()',
          'calendars (los 5 sistemas no-gregorianos juntos) — ~1.35 KB gzip; locales (todos los ~47 idiomas) se cargan bajo demanda con loadAllLocales(), no de fábrica',
        ],
        examples: [
          {
            title: 'El bundle más liviano posible (y su trampa)',
            description:
              'Los subpaths de framework (react/vue/svelte/solid/qwik/angular) importan el core directamente — NO instalan el polyfill por sí solos, igual que /native.',
            code: `// Costo total aproximado: chunk core compartido (~9.2 KB gzip) + react/index (~0.7 KB gzip)
import { useCurrentTime } from '@bereasoftware/time-guard/react';

// TRAMPA: si tu entorno NO tiene globalThis.Temporal nativo, esto lanzará
// "Temporal API not loaded" en cuanto se use — /react (como /native) asume
// que Temporal ya existe, no lo instala. Para arreglarlo, importa el entry
// principal UNA VEZ en cualquier parte de tu app (basta el side-effect):
import '@bereasoftware/time-guard'; // instala el polyfill globalmente (+~52 KB gzip)`,
          },
        ],
      },
    ],
  },
  {
    id: 'i18n',
    title: 'Internacionalización',
    iconName: 'Globe',
    items: [
      {
        id: 'locales',
        title: 'Configuración de Idiomas',
        subtitle: 'Soporte completo para más de 40 locales nativos',
        description:
          'TimeGuard utiliza un gestor de locales (`LocaleManager`) que permite registrar y cargar idiomas bajo demanda. La biblioteca soporta familias lingüísticas como Español, Románicas, Eslavas, Nórdicas, Asiáticas, de Oriente Medio y africanas sin sobrecargar el tamaño de tu bundle inicial.',
        features: [
          'loadAllLocales() — registra los locales bundleados en el LocaleManager global',
          'getAvailableLocales() — lista de códigos de locale disponibles para registrar',
          'LOCALES_COUNT — total de locales bundleados (constante, sin necesidad de cargarlos)',
          'registerAllLocales(map) — variante de bajo nivel para inyectar en tu propio Map/Record en vez del LocaleManager global',
          '⚠️ Pluralización simplificada: humanize()/duration usan un switch singular/plural binario (1 vs. resto) — no las reglas completas de Intl.PluralRules, así que idiomas con más de 2 categorías (ruso, polaco, árabe, etc.) pueden mostrar una forma gramaticalmente incorrecta para ciertos números',
        ],
        examples: [
          {
            title: 'Formateo con Locales Dinámicos',
            description:
              'Cambio dinámico del idioma de una instancia para formatear meses y días de la semana.',
            code: `import { TimeGuard, loadAllLocales } from '@bereasoftware/time-guard';

// El core solo trae en/es por defecto — carga el resto una sola vez:
loadAllLocales();

const date = TimeGuard.from('2026-05-20');

// Formatear en Español
console.log(date.locale('es').format('dddd, DD MMMM YYYY'));
// Output: "miércoles, 20 mayo 2026"

// Formatear en Japonés
console.log(date.locale('ja').format('YYYY年M月D日'));
// Output: "2026年5月20日"

// Formatear en Swahili (África)
console.log(date.locale('sw').format('dddd, DD MMMM YYYY'));
// Output: "Jumatano, 20 Mei 2026"`,
          },
          {
            title: 'Inspeccionar el Registro de Locales',
            description:
              'Consultar cuántos locales hay disponibles sin cargarlos, y sus códigos exactos.',
            code: `import { LOCALES_COUNT, getAvailableLocales } from '@bereasoftware/time-guard';

// Constante — no requiere loadAllLocales() previo
console.log(LOCALES_COUNT); // 47

// Códigos exactos (útil para poblar un <select> de idiomas)
console.log(getAvailableLocales());
// ['en', 'es', 'fr', 'de', 'ja', 'ar', 'zh-cn', 'ru', 'pt-br', 'sw', ...]`,
          },
        ],
      },
    ],
  },
  {
    id: 'advanced',
    title: 'Cálculos Avanzados',
    iconName: 'TrendingUp',
    items: [
      {
        id: 'timerange',
        title: 'Rangos de Tiempo (TimeRange)',
        subtitle: 'Operaciones de conjuntos sobre intervalos de tiempo',
        description:
          'La clase `TimeRange` representa un intervalo entre dos fechas y permite realizar operaciones semánticas como intersección, unión, verificación de inclusión y superposición de rangos de manera fluida.',
        examples: [
          {
            title: 'Operaciones entre Intervalos',
            description: 'Evaluación y mezcla de rangos de tiempo.',
            code: `import { TimeGuard, TimeRange } from '@bereasoftware/time-guard';

const rangeA = new TimeRange(TimeGuard.from('2026-05-20'), TimeGuard.from('2026-05-25'));
const rangeB = new TimeRange(TimeGuard.from('2026-05-23'), TimeGuard.from('2026-05-30'));

// Comprobar superposición e intersección
console.log(rangeA.overlaps(rangeB)); // true

const intersection = rangeA.intersect(rangeB);
console.log(intersection.start.format('YYYY-MM-DD')); // "2026-05-23"
console.log(intersection.end.format('YYYY-MM-DD'));   // "2026-05-25"

// Unión de rangos
const unionRange = rangeA.union(rangeB);
console.log(unionRange.end.format('YYYY-MM-DD'));     // "2026-05-30"`,
          },
        ],
      },
      {
        id: 'businessdays',
        title: 'Días Laborables y Feriados',
        subtitle: 'Control completo de calendarios laborales corporativos',
        description:
          'TimeGuard incluye utilidades nativas para registrar feriados públicos, calcular si un día es fin de semana o feriado, y realizar operaciones aritméticas avanzadas omitiendo días no hábiles.',
        examples: [
          {
            title: 'Aritmética de Días Hábiles',
            description:
              'Suma de días hábiles omitiendo fines de semana y días festivos registrados.',
            code: `import { TimeGuard } from '@bereasoftware/time-guard';

// Registrar feriados de forma global
TimeGuard.registerHolidays(['2026-05-25', '2026-05-29']);

const date = TimeGuard.from('2026-05-22'); // Es Viernes

// Sumar 3 días hábiles
// Omitirá: Sábado 23, Domingo 24, Feriado Lunes 25
const delivery = date.addBusinessDays(3);

console.log(delivery.format('dddd, DD MMMM YYYY'));
// Output: "jueves, 28 mayo 2026" (Viernes 22 -> Martes 26 (1) -> Miércoles 27 (2) -> Jueves 28 (3))`,
          },
        ],
      },
      {
        id: 'diff-modes',
        title: 'diff() — Modos Exact y Calendar',
        subtitle: 'Diferencias con signo en una unidad, o desglose sin signo',
        description:
          'El método `diff()` tiene dos formas: `diff(other, unit)` devuelve un número con signo (this - other) en una sola unidad — igual convención que moment/dayjs. `diff(other, { mode, unit? })` devuelve un `DiffResult` con más poder: modo `exact` (total exacto en la unidad pedida) o `calendar` (desglose sin signo en años/meses/días, igual que `between()`).',
        features: [
          'diff(other, unit) — número con signo, this menos other (negativo si this es anterior)',
          "diff(other, { mode: 'exact', unit }) — DiffResult.as(unit) para el total exacto en cualquier unidad",
          "diff(other, { mode: 'calendar' }) — DiffResult.breakdown() con años/meses/días, siempre positivo (como between())",
          'DiffResult.format(locale) — texto humanizado directo, sin llamar humanize() por separado',
          'DiffResult.getMode() — inspecciona qué modo generó el resultado',
        ],
        examples: [
          {
            title: 'Signo, modo exacto y modo calendario',
            description:
              'Los tres estilos de diff() sobre el mismo par de fechas.',
            code: `import { TimeGuard } from '@bereasoftware/time-guard';

const start = TimeGuard.from('2026-01-15');
const end = TimeGuard.from('2026-03-20');

// Forma corta: número con signo (this - other)
console.log(start.diff(end, 'day')); // -64 (start es anterior a end)

// Modo exact: total exacto en la unidad pedida
const exact = start.diff(end, { mode: 'exact', unit: 'day' });
console.log(exact.as('day'));      // -64
console.log(exact.breakdown());    // null — exact no genera desglose

// Modo calendar: desglose años/meses/días, siempre positivo
const cal = start.diff(end, { mode: 'calendar' });
console.log(cal.breakdown());
// { years: 0, months: 2, weeks: 0, days: 5, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }
console.log(cal.format('en')); // "2 months and 5 days"
console.log(cal.format('es')); // "2 meses y 5 días"`,
          },
        ],
      },
      {
        id: 'duration-result',
        title: 'DurationResult — Explicación y Métricas',
        subtitle: 'humanize, total() y explain() para cálculos profundos',
        description:
          'El objeto `DurationResult` devuelto por `until()`, `since()` y `between()` no solo contiene el desglose de años, meses, días, horas, etc. — también incluye métodos poderosos para convertir a cualquier unidad, generar explicaciones paso a paso del cálculo (ideal para debugging y educación), y humanizar el resultado en múltiples idiomas.',
        features: [
          'humanize({ locale, fullBreakdown }) — texto legible en cualquier idioma',
          'total(unit) — conversión precisa a cualquier unidad (días, horas, meses, etc.)',
          'explain() — desglose educativo paso a paso con detección de años bisiestos',
          'toJSON() — representación como objeto para APIs respuestas',
        ],
        examples: [
          {
            title: 'DurationResult en acción',
            description:
              'Uso completo de humanize, total y explain para cálculos de duración.',
            code: `import { TimeGuard } from '@bereasoftware/time-guard';

const start = TimeGuard.from('2024-01-15');
const end = TimeGuard.from('2026-05-20');

const duration = start.until(end);

// Humanizar
console.log(duration.humanize({ locale: 'es', fullBreakdown: true }));
// "2 años, 4 meses y 5 días"

// Convertir a unidad específica (métricas de negocio)
console.log(duration.total('days'));   // 856 días
console.log(duration.total('hours'));  // 20544 horas

// Explicación educativa del cálculo
const explanation = duration.explain();
console.log(explanation.explanation);
// "Calculated duration from 2024-01-15 to 2026-05-20..."
console.log(explanation.steps);
// ["Parsed dates: 2024-01-15...", "2024 is a leap year...", "Years: 2", ...]`,
          },
        ],
      },
    ],
  },
  {
    id: 'calendars',
    title: 'Sistemas de Calendario',
    iconName: 'CalendarDays',
    items: [
      {
        id: 'calendars-overview',
        title: 'Calendarios Built-in',
        subtitle: 'Gregoriano, Islámico, Hebreo, Chino, Japonés y Budista',
        description:
          'TimeGuard incluye soporte nativo para 6 sistemas de calendario a través del `CalendarManager`. Cada calendario implementa la interfaz `ICalendarSystem` con métodos para obtener nombres de meses/días, verificar años bisiestos y calcular días por mes/año. Puedes registrar calendarios personalizados fácilmente. ⚠️ Islámico, Hebreo y Chino usan aproximaciones simplificadas (marcadas `@experimental` en el código fuente) — no son válidos para fechas religiosas o civiles oficiales.',
        features: [
          'Gregoriano (gregory) — calendario ISO estándar internacional, exacto',
          'Japonés (japanese) — calendario imperial japonés, exacto',
          'Budista (buddhist) — calendario de la Era Budista, exacto',
          '⚠️ Islámico (islamic) — calendario Hijri, aproximación experimental',
          '⚠️ Hebreo (hebrew) — calendario judío, aproximación experimental',
          '⚠️ Chino (chinese) — calendario tradicional chino, aproximación experimental (incluye getZodiacSign())',
        ],
        examples: [
          {
            title: 'Usar Calendarios Alternativos',
            description:
              'Obtener nombres de meses, días y verificar años bisiestos en distintos sistemas de calendario.',
            code: `import { CalendarManager } from '@bereasoftware/time-guard';
import { IslamicCalendar } from '@bereasoftware/time-guard/calendars';

const manager = CalendarManager.getInstance();

// Los calendarios built-in ya están registrados
console.log(manager.list());
// ['gregory', 'islamic', 'hebrew', 'chinese', 'japanese', 'buddhist']

const islamic = manager.get('islamic')!;
console.log(islamic.getMonthName(1));        // "Muharram"
console.log(islamic.getWeekdayName(6));      // "Yawm al-Jum'ah" (Viernes)
console.log(islamic.isLeapYear(1447));       // true

// Registrar un calendario personalizado
manager.register(new IslamicCalendar());

// El gregoriano es el default
const gregory = manager.getDefault();
console.log(gregory.daysInMonth(2026, 2));   // 28 (Febrero no bisiesto)

// Chino: signo zodiacal del año
import { ChineseCalendar } from '@bereasoftware/time-guard/calendars';
console.log(new ChineseCalendar().getZodiacSign(2026)); // "Horse" (Caballo)`,
          },
          {
            title: 'Registrar un Calendario Personalizado',
            description:
              'Cualquier sistema que implemente `ICalendarSystem` puede registrarse junto a los 6 built-in.',
            code: `import { CalendarManager } from '@bereasoftware/time-guard';
import type { ICalendarSystem } from '@bereasoftware/time-guard';

class FiscalYearCalendar implements ICalendarSystem {
  id = 'fiscal-year';
  name = 'Fiscal Year (Apr-Mar)';
  // Año fiscal que arranca en abril — delega el resto en el gregoriano.
  getMonthName(month: number): string {
    return ['Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic','Ene','Feb','Mar'][month - 1];
  }
  getWeekdayName(day: number): string {
    return ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'][day - 1];
  }
  isLeapYear(year: number): boolean {
    return new Date(year, 1, 29).getMonth() === 1;
  }
  daysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
  }
  daysInYear(year: number): number {
    return this.isLeapYear(year) ? 366 : 365;
  }
}

CalendarManager.getInstance().register(new FiscalYearCalendar());
console.log(CalendarManager.getInstance().list());
// ['gregory', 'islamic', 'hebrew', 'chinese', 'japanese', 'buddhist', 'fiscal-year']`,
          },
        ],
      },
    ],
  },
  {
    id: 'plugins',
    title: 'Plugins Disponibles',
    iconName: 'Cpu',
    items: [
      {
        id: 'plugin-mgr',
        title: 'Sistema de Plugins Modular',
        subtitle: 'Extensibilidad y ligereza bajo demanda',
        description:
          'Mediante el `PluginManager`, puedes inyectar módulos avanzados a la clase principal de `TimeGuard`. Esto mantiene el core ligero y carga características pesadas solo si tu aplicación las requiere — ver el tamaño exacto de cada plugin en "Tamaño del Bundle y Entry Points".',
        examples: [
          {
            title: 'Relative Time Plugin',
            description:
              'Inyección del plugin de tiempo relativo para humanizar diferencias de tiempo.',
            code: `import { TimeGuard, PluginManager } from '@bereasoftware/time-guard';
import relativeTimePlugin from '@bereasoftware/time-guard/plugins/relative-time';

// Cargar plugin
PluginManager.use(relativeTimePlugin, TimeGuard);

const past = TimeGuard.from('2026-05-20T08:00:00');
const now = TimeGuard.from('2026-05-20T09:30:00');

console.log(past.since(now).humanize({ locale: 'es' }));
// Output: "hace 1 hora"`,
          },
          {
            title: 'ISO Duration Plugin',
            description:
              'Manipulación y conversión de duraciones estándar ISO 8601.',
            code: `import { Duration } from '@bereasoftware/time-guard/plugins/duration';

const duration = Duration.fromISO('P2Y3M4D');

console.log(duration.humanize({ locale: 'es' }));
// Output: "2 años, 3 meses y 4 días"

console.log(duration.asDays()); // 1159 días aproximados`,
          },
        ],
      },
      {
        id: 'relative-time-plugin',
        title: 'Relative Time Plugin — En Profundidad',
        subtitle: 'fromNow(), toNow(), y umbrales/formatos personalizados',
        description:
          'Además de habilitar `since().humanize()`, el plugin añade sus propios métodos `fromNow()`/`toNow()` a `TimeGuard`, con un algoritmo de umbrales configurable (igual convención que dayjs: `{ l, r, d }` — etiqueta, rango, unidad). Puedes instanciar `new RelativeTimePlugin(config)` para personalizar los umbrales o la función de redondeo antes de registrarlo.',
        features: [
          'fromNow(withoutSuffix?) — "hace 5 horas" / "5 horas" sin el sufijo',
          'toNow(withoutSuffix?) — misma lógica en sentido futuro ("en 5 horas")',
          'new RelativeTimePlugin({ thresholds, rounding }) — umbrales y redondeo personalizados en el constructor',
          'plugin.setFormats({ ... }) / plugin.getFormats() — sobrescribe las plantillas de texto (ej. "hace %d horas") sin tocar los umbrales',
        ],
        examples: [
          {
            title: 'fromNow()/toNow() con umbrales personalizados',
            description:
              'Registra el plugin con una instancia configurada en vez del default.',
            code: `import { TimeGuard, PluginManager } from '@bereasoftware/time-guard';
import { RelativeTimePlugin } from '@bereasoftware/time-guard/plugins/relative-time';

// Umbral personalizado: "un instante" hasta los 10s, luego segundos exactos.
// Nota: setFormats() sobrescribe TODAS las plantillas usadas — incluyendo
// future/past ("en %s" / "hace %s") — no solo las etiquetas de umbral (s/ss).
// Si solo cambias s/ss y dejas future/past en su valor inglés por defecto
// ("in %s"/"%s ago"), el resultado mezcla idiomas (ej. "hace 30 segundos ago").
const plugin = new RelativeTimePlugin({
  thresholds: [
    { l: 's', r: 10, d: 'second' },
    { l: 'ss', d: 'second' },
  ],
  rounding: Math.floor,
});
plugin.setFormats({
  future: 'en %s',
  past: 'hace %s',
  s: 'un instante',
  ss: '%d segundos',
});

PluginManager.use(plugin, TimeGuard);

const past = TimeGuard.now().subtract({ second: 30 }) as any;
console.log(past.fromNow());               // "hace 30 segundos"
console.log(past.fromNow(true));           // "30 segundos" (sin sufijo)

const veryRecent = TimeGuard.now().subtract({ second: 3 }) as any;
console.log(veryRecent.fromNow());         // "hace un instante"`,
          },
        ],
      },
      {
        id: 'advanced-format-plugin',
        title: 'Advanced Format Plugin',
        subtitle:
          'Tokens de formato adicionales: trimestre, ordinales, semana ISO',
        description:
          'El plugin `advanced-format` extiende `.format()` con tokens que no forman parte del set base — útil para reportes de negocio (trimestres), UI legible (ordinales "1st", "13th") y semántica ISO (semana del año, hora 1-24, timestamps Unix).',
        features: [
          'Q — trimestre del año (1-4)',
          'Do — día ordinal (1st, 2nd, 3rd, 4th...)',
          'w / ww, W / WW — semana del año (locale vs. ISO), con o sin cero relleno',
          'gggg / GGGG — año de semana (locale vs. ISO)',
          'k / kk — hora en formato 1-24 (en vez de 0-23)',
          'X / x — timestamp Unix en segundos / milisegundos',
          'z — offset UTC (ej. "+09:00") · zzz — id de zona IANA (ej. "Asia/Tokyo"), vacío si la instancia no tiene zona asociada',
        ],
        examples: [
          {
            title: 'Tokens de formato avanzado',
            description:
              'Registrar el plugin una vez y combinar sus tokens con el formato estándar.',
            code: `import { TimeGuard, PluginManager } from '@bereasoftware/time-guard';
import advancedFormatPlugin from '@bereasoftware/time-guard/plugins/advanced-format';

PluginManager.use(advancedFormatPlugin, TimeGuard);

const date = TimeGuard.from('2026-07-15T14:30:00');

console.log(date.format('Q [T]YYYY'));      // "3 T2026" (Q3)
console.log(date.format('Do MMMM YYYY'));   // "15th July 2026"
console.log(date.format('w'));              // semana del año
console.log(date.format('X'));               // timestamp Unix en segundos

const paris = date.timezone('Europe/Paris');
console.log(paris.format('z'));              // "+02:00"
console.log(paris.format('zzz'));            // "Europe/Paris"`,
          },
        ],
      },
      {
        id: 'duration-plugin',
        title: 'Duration Plugin — En Profundidad',
        subtitle:
          'La clase Duration completa: conversión, ISO 8601, aritmética',
        description:
          'Más allá de `fromISO()`, `Duration` cubre construcción entre fechas, desde milisegundos, conversión a cualquier unidad, serialización ISO 8601 e inspección de signo. El plugin también añade un método de instancia `.duration(other)` a `TimeGuard` y expone la clase como `TimeGuard.Duration` una vez registrado.',
        features: [
          'Duration.between(from, to) — duración entre dos TimeGuard (equivalente a from.duration(to) tras registrar el plugin)',
          'Duration.fromMilliseconds(ms) — construye desde un total de milisegundos',
          '.as(unit) / .asDays() / .asHours() / .asWeeks() / etc. — conversión a cualquier unidad',
          '.toISO() — serializa a ISO 8601 (los años/meses se mantienen, semanas se pliegan en días: weeks*7 + days)',
          '.isNegative() / .abs() — inspección y normalización de signo',
          '.toObject() — desglose plano { years, months, weeks, days, hours, minutes, seconds, milliseconds }',
        ],
        examples: [
          {
            title: 'API completa de Duration',
            description:
              'Construcción, conversión, ISO 8601 y aritmética de signo.',
            code: `import { TimeGuard, PluginManager } from '@bereasoftware/time-guard';
import { Duration, durationPlugin } from '@bereasoftware/time-guard/plugins/duration';

PluginManager.use(durationPlugin, TimeGuard);

const start = TimeGuard.from('2026-03-13');
const end = TimeGuard.from('2026-03-20');

// Método de instancia (añadido por el plugin) vs. estático — mismo resultado
console.log(start.duration(end).asDays());   // 7
console.log(Duration.between(start, end).asDays()); // 7

// Desde milisegundos, y conversión a cualquier unidad
const fromMs = Duration.fromMilliseconds(1000 * 60 * 60 * 36);
console.log(fromMs.as('hours')); // 36

// Signo
const negative = new Duration({ days: -5 });
console.log(negative.isNegative());     // true
console.log(negative.abs().asDays());   // 5

// ISO 8601 — semanas se pliegan en días en la SALIDA (no en la entrada)
const iso = new Duration({ years: 1, months: 2, weeks: 3, days: 4, hours: 5 });
console.log(iso.toISO());     // "P1Y2M25DT5H" (3 semanas + 4 días = 25 días)
console.log(iso.toObject());  // { years: 1, months: 2, weeks: 3, days: 4, hours: 5, ... }`,
          },
        ],
      },
      {
        id: 'plugin-authoring',
        title: 'Crear un Plugin Personalizado',
        subtitle:
          'La interfaz ITimeGuardPlugin — extiende TimeGuard sin tocar el core',
        description:
          'Cualquier funcionalidad que no necesite todos los consumidores (tiempo relativo, duraciones ISO, tokens avanzados) vive fuera del core como plugin. Escribir uno propio solo requiere implementar `ITimeGuardPlugin`: un `name`, una `version`, y un método `install()` que reciba la clase `TimeGuard` y le añada métodos vía su `prototype`.',
        features: [
          'install(TimeGuardClass, config?) — punto de entrada único, llamado por PluginManager.use()',
          'Los métodos se añaden al prototype — cada instancia existente y futura los hereda',
          'PluginManager.hasPlugin() / listPlugins() / unuse() — introspección y ciclo de vida',
          'Los plugins built-in (relative-time, duration, advanced-format) usan exactamente este mismo contrato',
          "declare module + interface merging — así los 3 plugins built-in tipan sus propios métodos añadidos, en vez de castear a 'any' del lado del consumidor",
        ],
        examples: [
          {
            title: 'Plugin mínimo: fiscalQuarter() con tipado real',
            description:
              'Un plugin que añade fiscalQuarter() a todas las instancias — y lo tipa vía declaration merging, para no forzar "as any" en quien lo consume.',
            code: `import { TimeGuard, PluginManager } from '@bereasoftware/time-guard';
import type { ITimeGuardPlugin } from '@bereasoftware/time-guard';

// Declaration merging: TypeScript une esta interfaz con la clase TimeGuard.
// Cualquier archivo que importe TimeGuard después de este verá el método
// tipado — sin necesidad de "as any" en el sitio de la llamada.
declare module '@bereasoftware/time-guard' {
  interface TimeGuard {
    fiscalQuarter(fiscalYearStartMonth?: number): number;
  }
}

class FiscalQuarterPlugin implements ITimeGuardPlugin {
  name = 'fiscal-quarter';
  version = '1.0.0';

  install(TimeGuardClass: typeof TimeGuard): void {
    // El cast sigue siendo necesario AQUÍ (install() modifica el prototype
    // dinámicamente) — pero solo una vez, dentro del plugin. El consumidor
    // nunca lo ve gracias al "declare module" de arriba.
    (
      TimeGuardClass.prototype as unknown as {
        fiscalQuarter: (fiscalYearStartMonth?: number) => number;
      }
    ).fiscalQuarter = function (fiscalYearStartMonth = 4): number {
      const month = this.month(); // 1-12
      const shifted = ((month - fiscalYearStartMonth + 12) % 12) + 1;
      return Math.ceil(shifted / 3);
    };
  }
}

PluginManager.use(new FiscalQuarterPlugin(), TimeGuard);

const date = TimeGuard.from('2026-05-20');
console.log(date.fiscalQuarter()); // 2 (año fiscal desde abril) — totalmente tipado

// Introspección
console.log(PluginManager.hasPlugin('fiscal-quarter')); // true
console.log(PluginManager.listPlugins()); // [..., 'fiscal-quarter']`,
          },
        ],
      },
    ],
  },
  {
    id: 'frameworks',
    title: 'Integración Frameworks',
    iconName: 'Layers',
    items: [
      {
        id: 'fw-integrations',
        title: 'Adaptores y Wrappers Nativos',
        subtitle:
          'Experiencia premium en React, Vue, Angular, Svelte, SolidJS y Qwik',
        description:
          'TimeGuard provee submódulos altamente optimizados para los 6 frameworks frontend más populares del ecosistema, listos para producción con control de memory leaks y optimizaciones de CPU. Cada wrapper se adapta idiomáticamente al modelo de reactividad del framework.',
        features: [
          'React — TimeGuardProvider + hooks (useTimeGuard, useCurrentTime, useRelativeTime, useTimeRange)',
          'Vue 3 — TimeGuardVuePlugin + directiva v-time-guard + composables (useTimeGuard, useCurrentTime, useRelativeTime)',
          'Angular — TimeGuardService (RxJS observable) + pipes (timeGuardFormat, timeGuardRelative, timeGuardLiveFormat)',
          'Svelte 4/5 — Stores Readable reactivas con duck-typing para inputs reactivos',
          'SolidJS — Signals con createEffect y limpieza automática de intervalos',
          'Qwik — Signals + useVisibleTask$ + useTask$ con tracking reactivo',
        ],
        examples: [
          {
            title: 'React · Context + Hooks',
            description:
              'Configuración global via TimeGuardProvider y hooks reactivos en React.',
            code: `import { TimeGuardProvider, useCurrentTime } from '@bereasoftware/time-guard/react';

function App() {
  return (
    <TimeGuardProvider config={{ locale: 'es' }}>
      <Clock />
    </TimeGuardProvider>
  );
}

function Clock() {
  const now = useCurrentTime(); // actualiza cada segundo heredando 'es'
  return <h1>{now.format('HH:mm:ss')}</h1>;
}`,
          },
          {
            title: 'Vue 3 · Directiva + Composables',
            description:
              'Directivas reactivas e inyecciones de Composition API en Vue 3.',
            code: `<!-- Plantilla Vue -->
<template>
  <div>
    <span v-time-guard:format="'now'" data-pattern="HH:mm:ss" data-live="true"></span>
  </div>
</template>

<script setup>
import { useCurrentTime } from '@bereasoftware/time-guard/vue';
const now = useCurrentTime({ interval: 1000 });
</script>`,
          },
          {
            title: 'Angular · Pipes + RxJS Live',
            description:
              'Pipes reactivos con cambio optimizado corriendo fuera de NgZone en Angular.',
            code: `// Código HTML de plantilla
<h2>{{ 'now' | timeGuardLiveFormat:'HH:mm:ss':1000 }}</h2>

// Módulo o Configuración DI
providers: [
  {
    provide: TIME_GUARD_CONFIG,
    useValue: { locale: 'es' }
  }
]`,
          },
          {
            title: 'React · useTimeGuard() y useTimeGuardConfig()',
            description:
              'El hook genérico detrás de useCurrentTime, y cómo leer la config heredada del Provider sin crear una instancia.',
            code: `import { useTimeGuard, useTimeGuardConfig } from '@bereasoftware/time-guard/react';

function LastUpdated({ isoString }: { isoString: string }) {
  // useTimeGuard(input, config?) — instancia reactiva a partir de CUALQUIER
  // input (no solo "ahora" tickeando); se recalcula si input o config cambian.
  const tg = useTimeGuard(isoString);
  return <span>{tg.format('DD MMM YYYY, HH:mm')}</span>;
}

function ConfigDebug() {
  // Lee la config activa del TimeGuardProvider más cercano (o undefined si no hay uno)
  const config = useTimeGuardConfig();
  return <pre>{JSON.stringify(config)}</pre>;
}`,
          },
          {
            title: 'Vue · useTimeGuard() genérico',
            description:
              'Pásale un Ref (o un getter) para que reaccione a sus cambios — un valor plano se lee una sola vez y no se actualiza solo.',
            code: `<script setup lang="ts">
import { ref } from 'vue';
import { useTimeGuard } from '@bereasoftware/time-guard/vue';

const deadline = ref('2026-12-25');

// Pasar el Ref (no deadline.value) — useTimeGuard usa toValue() internamente
// para desenvolverlo dentro de su propio watch, y así rastrear el cambio.
const tg = useTimeGuard(deadline);

function changeDeadline() {
  deadline.value = '2027-01-01'; // tg se recalcula automáticamente
}
</script>

<template>
  <p>{{ tg.format('dddd, DD MMMM YYYY') }}</p>
  <button @click="changeDeadline">Cambiar fecha</button>
</template>`,
          },
        ],
      },
      {
        id: 'fw-svelte',
        title: 'Svelte 4/5 — Stores Reactivas',
        subtitle:
          'Readable stores con limpieza automática y duck-typing para inputs reactivos',
        description:
          'El wrapper oficial `@bereasoftware/time-guard/svelte` proporciona stores Readable que se integran naturalmente con el sistema de reactividad de Svelte. Compatible con Svelte 4 ($store auto-subscription) y Svelte 5 ($state + get()). Incluye un sistema de duck-typing que acepta tanto valores planos como stores de Svelte como entrada, para reactividad completa cuando los props cambian.',
        features: [
          'useTimeGuard(input, config?) — store reactivo que acepta valores planos o Readable<unknown>',
          'useCurrentTime({ interval, config }) — store del tiempo actual con intervalo y cleanup automático',
          'useRelativeTime(date, options?) — store de texto relativo que se recalcula periódicamente',
          'useTimeRange(start, end, config?) — store reactivo derivado de dos inputs con toStore/derived',
          'TimeGuardConfigKey — injection key para getContext() con configuración global',
        ],
        examples: [
          {
            title: 'Svelte · Reloj en Vivo con useCurrentTime',
            description:
              'Store Readable que tickea cada 1000ms y se limpia automáticamente al desmontar.',
            code: `<script lang="ts">
  import { useCurrentTime } from '@bereasoftware/time-guard/svelte';
  const now = useCurrentTime({ interval: 1000 });
</script>

<main>
  <h1>{$now.locale('es').format('dddd, DD MMMM YYYY')}</h1>
  <p>{$now.format('HH:mm:ss.SSS')}</p>
</main>

<style>
  :global(:root) { color-scheme: dark; }
  :global(body) { font-family: ui-sans-serif, system-ui; background: #1a1a2e; color: #e2e8f0; }
  main { padding: 24px; max-width: 720px; margin: 0 auto; }
  h1 { font-size: 28px; margin: 0 0 8px; }
  p { font-size: 48px; font-weight: 700; color: #ff3e00; font-family: 'JetBrains Mono', monospace; }
</style>`,
          },
          {
            title: 'Svelte · useTimeGuard() con un store como input',
            description:
              'El hook genérico acepta un valor plano O un store Svelte — si detecta un store (duck-typing), deriva de él automáticamente.',
            code: `<script lang="ts">
  import { writable } from 'svelte/store';
  import { useTimeGuard } from '@bereasoftware/time-guard/svelte';

  // Un store normal de la app — ej. la fecha seleccionada en un date picker
  const selectedDate = writable('2026-05-20');

  // useTimeGuard detecta que selectedDate es un store y deriva de él:
  // cada vez que selectedDate cambia, el store devuelto se recalcula.
  const tg = useTimeGuard(selectedDate);
</script>

<p>{$tg.format('dddd, DD MMMM YYYY')}</p>
<button on:click={() => selectedDate.set('2026-12-25')}>Ir a Navidad</button>`,
          },
        ],
        demoComponentId: 'svelte-demo',
      },
      {
        id: 'fw-solid',
        title: 'SolidJS — Signals Granulares',
        subtitle:
          'Accessors con createEffect y limpieza automática en onCleanup',
        description:
          'El wrapper oficial `@bereasoftware/time-guard/solid` expone hooks basados en signals de SolidJS, aprovechando su reactividad granular para actualizar solo las partes del DOM que cambian. Los intervalos se limpian automáticamente con onCleanup, sin fugas de memoria. Perfecto para dashboards en tiempo real y componentes de alto rendimiento.',
        features: [
          'useTimeGuard(input, config?) — Accessor<TimeGuard> que se actualiza con createEffect',
          'useCurrentTime({ interval, config }) — signal del tiempo actual con setInterval + onCleanup',
          'useRelativeTime(date, options?) — signal de texto relativo que se recalcula cada 60s',
          'useTimeRange(start, end, config?) — signal de TimeRange con createEffect para reactividad',
          'TimeGuardConfigContext — clave de contexto para configuración global vía createContext',
        ],
        examples: [
          {
            title: 'SolidJS · Reloj en Vivo con Signals',
            description:
              'Signal que actualiza el DOM de forma granular sin re-renderizar componentes hermanos.',
            code: `import { useCurrentTime } from '@bereasoftware/time-guard/solid';

export default function Clock() {
  const now = useCurrentTime({ interval: 1000 });

  return (
    <main style={{ padding: '24px', 'max-width': '720px', margin: '0 auto',
      'font-family': 'ui-sans-serif, system-ui', background: '#0a1628',
      color: '#e2e8f0', 'min-height': '100vh' }}>
      <h1 style={{ 'font-size': '28px', margin: '0 0 8px' }}>
        {now().locale('es').format('dddd, DD MMMM YYYY')}
      </h1>
      <p style={{ 'font-size': '48px', 'font-weight': '700', color: '#2c4f7c',
        'font-family': "'JetBrains Mono', monospace" }}>
        {now().format('HH:mm:ss.SSS')}
      </p>
    </main>
  );
}`,
          },
          {
            title: 'SolidJS · useTimeGuard() genérico',
            description:
              'A diferencia de useCurrentTime, useTimeGuard no tickea por sí solo — reacciona cuando cambia el Accessor que le pasas. Importante: pásale el Accessor (deadline), no su valor (deadline()).',
            code: `import { createSignal } from 'solid-js';
import { useTimeGuard } from '@bereasoftware/time-guard/solid';

export default function DueDate() {
  const [deadline, setDeadline] = createSignal('2026-12-25');

  // deadline (el accessor), NO deadline() — así useTimeGuard puede
  // llamarlo dentro de su propio createEffect y rastrear el cambio.
  const tg = useTimeGuard(deadline);

  return (
    <>
      <p>{tg().format('dddd, DD MMMM YYYY')}</p>
      <button onClick={() => setDeadline('2027-01-01')}>Cambiar fecha</button>
    </>
  );
}`,
          },
        ],
        demoComponentId: 'solid-demo',
      },
      {
        id: 'fw-qwik',
        title: 'Qwik — Resumable Signals',
        subtitle:
          'Signals + useVisibleTask$ + useTask$ con tracking reactivo automático',
        description:
          'El wrapper oficial `@bereasoftware/time-guard/qwik` sigue el modelo de resumabilidad de Qwik: usa useSignal para el estado local, useVisibleTask$ para efectos visibles con cleanup, y useTask$ para reaccionar a cambios de entrada. El wrapper no penaliza el TTI (Time To Interactive) porque los intervalos solo se activan cuando el componente se hidrata en el cliente.',
        features: [
          'useTimeGuard(input, config?) — Signal<TimeGuard> con useTask$ para reactividad a inputs',
          'useCurrentTime({ interval, config }) — signal del tiempo actual con useVisibleTask$ + cleanup',
          'useRelativeTime(date, options?) — signal de texto relativo que se recalcula periódicamente',
          'useTimeRange(start, end, config?) — signal de TimeRange con useTask$ y track() para ambos extremos',
          'Resumable — los intervalos solo se activan en hidratación, sin penalizar el rendering inicial',
        ],
        examples: [
          {
            title: 'Qwik · Reloj Resumable',
            description:
              'Signal de tiempo actual que solo se activa cuando el componente es visible en cliente.',
            code: `import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { TimeGuard } from '@bereasoftware/time-guard';

export default component$(() => {
  const iso = useSignal(TimeGuard.now().toISOString());

  useVisibleTask$(({ cleanup }) => {
    const id = setInterval(() => {
      iso.value = TimeGuard.now().locale('es').toISOString();
    }, 1000);
    cleanup(() => clearInterval(id));
  });

  return (
    <main style="padding: 24px; max-width: 720px; margin: 0 auto;
      font-family: ui-sans-serif, system-ui;">
      <h1 style="font-size: 28px; margin: 0 0 8px;">
        {TimeGuard.from(iso.value).format('dddd, DD MMMM YYYY')}
      </h1>
      <p style="font-size: 48px; font-weight: 700; color: #ac7ef4;
        font-family: 'JetBrains Mono', monospace;">
        {TimeGuard.from(iso.value).format('HH:mm:ss.SSS')}
      </p>
    </main>
  );
});`,
          },
          {
            title: 'Qwik · useTimeGuard() genérico',
            description:
              'Pásale un Signal para que reaccione a sus cambios vía track() — un valor plano se lee una sola vez, igual que en Vue/Solid.',
            code: `import { component$, useSignal } from '@builder.io/qwik';
import { useTimeGuard } from '@bereasoftware/time-guard/qwik';

export default component$(() => {
  const deadline = useSignal('2026-12-25');

  // Pasar el Signal (no deadline.value) — useTimeGuard lo detecta con
  // isSignal() y rastrea deadline.value dentro de su propio useTask$.
  const tg = useTimeGuard(deadline);

  return (
    <>
      <p>{tg.value.format('dddd, DD MMMM YYYY')}</p>
      <button onClick$={() => (deadline.value = '2027-01-01')}>
        Cambiar fecha
      </button>
    </>
  );
});`,
          },
        ],
        demoComponentId: 'qwik-demo',
      },
      {
        id: 'fw-react-demo',
        title: 'React — Hooks + Provider',
        subtitle:
          'useCurrentTime, useRelativeTime y TimeGuardProvider para reactividad completa',
        description:
          'El wrapper oficial `@bereasoftware/time-guard/react` proporciona hooks reactivos que se integran naturalmente con el ecosistema React. Usa `TimeGuardProvider` para configuración global vía Context, y hooks como `useCurrentTime`, `useRelativeTime` y `useTimeRange` para manejo reactivo de fechas con limpieza automática de intervalos al desmontar componentes.',
        features: [
          'TimeGuardProvider — contexto global con locale y timezone para toda la app',
          'useCurrentTime() — hook que retorna TimeGuard actualizado cada intervalo, sin memory leaks',
          'useRelativeTime() — texto relativo ("hace 5 minutos") que se recalcula automáticamente',
          'useTimeRange(start, end) — rango reactivo que se actualiza cuando cambian los extremos',
        ],
        examples: [
          {
            title: 'React · Provider + hooks reactivos',
            description:
              'TimeGuardProvider configura el locale global; useCurrentTime y useRelativeTime se actualizan solos sin fugas de memoria al desmontar.',
            code: `import { useState } from 'react';
import { useCurrentTime, useRelativeTime } from '@bereasoftware/time-guard/react';
import { TimeGuard } from '@bereasoftware/time-guard';

const pastDate = TimeGuard.now().subtract({ minute: 30 }).toDate();

export default function Clock() {
  const [locale, setLocale] = useState('es');
  const now = useCurrentTime({ interval: 1000 });
  const relative = useRelativeTime(pastDate);

  return (
    <div>
      <p>{now.locale(locale).format('HH:mm:ss')}</p>
      <p>Relativo: {relative}</p>
      <button onClick={() => setLocale((l) => (l === 'es' ? 'en' : 'es'))}>
        Cambiar a {locale === 'es' ? 'EN' : 'ES'}
      </button>
    </div>
  );
}`,
          },
        ],
        demoComponentId: 'react-demo',
      },
      {
        id: 'fw-vue-demo',
        title: 'Vue 3 — Composables + Directiva',
        subtitle:
          'useCurrentTime, useRelativeTime y v-time-guard para reactividad declarativa',
        description:
          'El wrapper oficial `@bereasoftware/time-guard/vue` expone composables de Composition API y una directiva personalizada `v-time-guard` para formateo reactivo en templates. Los composables son compatibles con `<script setup>` y limpian automáticamente los intervalos al desmontar el componente.',
        features: [
          'TimeGuardVuePlugin — plugin global que configura locale y registra la directiva',
          'useCurrentTime({ interval, config }) — Ref<TimeGuard> reactivo con cleanup automático',
          'useRelativeTime(date, options?) — Ref<string> de texto relativo con deep watching',
          'v-time-guard:format / :relative — directiva para formateo reactivo directo en templates',
        ],
        examples: [
          {
            title: 'Vue 3 · Composables + directiva',
            description:
              'useCurrentTime devuelve un Ref<TimeGuard> reactivo; la directiva v-time-guard formatea directamente en el template sin código extra.',
            code: `<template>
  <p>{{ now.locale(locale).format('HH:mm:ss') }}</p>
  <p>Relativo: {{ relative }}</p>
  <span v-time-guard:format="'now'" data-pattern="HH:mm:ss" data-live="true"></span>
  <button @click="locale = locale === 'es' ? 'en' : 'es'">Cambiar idioma</button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCurrentTime, useRelativeTime } from '@bereasoftware/time-guard/vue';
import { TimeGuard } from '@bereasoftware/time-guard';

const locale = ref<'es' | 'en'>('es');
const now = useCurrentTime({ interval: 1000 });
const relative = useRelativeTime(TimeGuard.now().subtract({ minute: 30 }).toDate());
</script>`,
          },
        ],
        demoComponentId: 'vue-demo',
      },
      {
        id: 'fw-angular-demo',
        title: 'Angular — Pipes + Servicio RxJS',
        subtitle:
          'TimeGuardFormatPipe, TimeGuardRelativePipe y TimeGuardService optimizados',
        description:
          'El wrapper oficial `@bereasoftware/time-guard/angular` proporciona pipes puros e impuros optimizados que ejecutan polling fuera de NgZone para minimizar detección de cambios innecesaria. Incluye un servicio injectable con observables RxJS para uso programático.',
        features: [
          'TIME_GUARD_CONFIG — token de inyección para configuración global',
          'TimeGuardFormatPipe — pipe puro para formateo ultrarrápido en templates',
          'TimeGuardRelativePipe — pipe impuro para tiempo relativo humanizado',
          'TimeGuardLiveFormatPipe — pipe live optimizado, corre fuera de NgZone para máximo rendimiento',
          'TimeGuardService — servicio injectable con getCurrentTime() observable',
        ],
        examples: [
          {
            title: 'Angular · Pipes standalone',
            description:
              'timeGuardLiveFormat sondea fuera de NgZone para no disparar detección de cambios innecesaria; timeGuardRelative formatea tiempo relativo.',
            code: `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TimeGuardLiveFormatPipe,
  TimeGuardRelativePipe,
} from '@bereasoftware/time-guard/angular';

@Component({
  selector: 'app-clock',
  standalone: true,
  imports: [CommonModule, TimeGuardLiveFormatPipe, TimeGuardRelativePipe],
  template: \`
    <p>{{ 'now' | timeGuardLiveFormat:'HH:mm:ss':1000:locale }}</p>
    <p>Relativo: {{ pastDate | timeGuardRelative:locale }}</p>
    <button (click)="toggleLocale()">Cambiar idioma</button>
  \`,
})
export class ClockComponent {
  locale: 'es' | 'en' = 'es';
  pastDate = new Date(Date.now() - 30 * 60 * 1000);

  toggleLocale(): void {
    this.locale = this.locale === 'es' ? 'en' : 'es';
  }
}`,
          },
        ],
        demoComponentId: 'angular-demo',
      },
    ],
  },
  {
    id: 'frameworks-playground',
    title: 'Frameworks Playground',
    iconName: 'PlayCircle',
    items: [
      {
        id: 'fw-vanilla',
        title: 'Vanilla TypeScript',
        subtitle: 'Reloj reactivo sin frameworks · solo TimeGuard + DOM',
        description:
          'Ejemplo idiomático en TypeScript puro: actualiza el DOM cada segundo usando `setInterval` y `TimeGuard.now()`. Ideal como punto de partida sin dependencias adicionales.',
        examples: [
          {
            title: 'Vanilla · Reloj en vivo',
            description:
              'Manipulación directa del DOM con TimeGuard. Sin frameworks ni dependencias extra.',
            code: `import { TimeGuard } from '@bereasoftware/time-guard';

const root = document.getElementById('app');
if (!root) throw new Error('#app no encontrado');

function render(): void {
  const now = TimeGuard.now().locale('es');
  root!.innerHTML = \`
    <h1>\${now.format('dddd, DD MMMM YYYY')}</h1>
    <p>\${now.format('HH:mm:ss')}</p>
  \`;
}

render();
setInterval(render, 1000);
`,
          },
        ],
      },
      {
        id: 'fw-vue',
        title: 'Vue 3',
        subtitle: 'Composición reactiva con `useCurrentTime`',
        description:
          'Aprovecha el wrapper oficial `@bereasoftware/time-guard/vue` para obtener un `Ref<TimeGuard>` reactivo que tickea cada segundo y limpia su intervalo automáticamente al desmontar.',
        examples: [
          {
            title: 'Vue · App.vue completo',
            description:
              'SFC con Composition API y limpieza automática de intervalos.',
            code: `<script setup lang="ts">
import { useCurrentTime } from '@bereasoftware/time-guard/vue';

const now = useCurrentTime({ interval: 1000 });
</script>

<template>
  <main>
    <h1>{{ now.locale('es').format('dddd, DD MMMM YYYY') }}</h1>
    <p>{{ now.format('HH:mm:ss') }}</p>
  </main>
</template>

<style>
:root { color-scheme: dark; }
body { font-family: ui-sans-serif, system-ui; background: #0f172a; color: #e2e8f0; margin: 0; }
main { padding: 24px; max-width: 720px; margin: 0 auto; }
h1 { font-size: 28px; margin: 0 0 8px; }
p { font-size: 18px; color: #42b883; }
</style>
`,
          },
        ],
      },
      {
        id: 'fw-react',
        title: 'React',
        subtitle: 'Hook `useCurrentTime` + `TimeGuardProvider`',
        description:
          'Configura el proveedor global y consume el hook reactivo. La memoria se libera automáticamente cuando el componente se desmonta.',
        examples: [
          {
            title: 'React · App.tsx completo',
            description: 'Provider + hook + estilos inline.',
            code: `import { TimeGuardProvider, useCurrentTime } from '@bereasoftware/time-guard/react';

function Clock() {
  const now = useCurrentTime({ interval: 1000 });
  return (
    <main style={{ padding: 24, maxWidth: 720, margin: '0 auto', fontFamily: 'ui-sans-serif, system-ui' }}>
      <h1 style={{ fontSize: 28, margin: '0 0 8px' }}>
        {now.format('dddd, DD MMMM YYYY')}
      </h1>
      <p style={{ fontSize: 18, color: '#61dafb' }}>
        {now.format('HH:mm:ss')}
      </p>
    </main>
  );
}

export default function App() {
  return (
    <TimeGuardProvider config={{ locale: 'es' }}>
      <Clock />
    </TimeGuardProvider>
  );
}
`,
          },
        ],
      },
      {
        id: 'fw-svelte-playground',
        title: 'Svelte 5',
        subtitle: 'Wrapper oficial @bereasoftware/time-guard/svelte + stores',
        description:
          'Usa el wrapper oficial `@bereasoftware/time-guard/svelte` con stores Readable que se limpian automáticamente al desmontar el componente. Compatible con Svelte 4 y Svelte 5.',
        examples: [
          {
            title: 'Svelte · App.svelte completo',
            description:
              'Idiomatic Svelte 5 con `$state` y limpieza de intervalos.',
            code: `<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { TimeGuard } from '@bereasoftware/time-guard';

  let now = $state(TimeGuard.now().locale('es'));
  let timer: ReturnType<typeof setInterval> | null = null;

  onMount(() => {
    timer = setInterval(() => {
      now = TimeGuard.now().locale('es');
    }, 1000);
  });

  onDestroy(() => {
    if (timer) clearInterval(timer);
  });
</script>

<main>
  <h1>{now.format('dddd, DD MMMM YYYY')}</h1>
  <p>{now.format('HH:mm:ss')}</p>
</main>

<style>
  :global(:root) { color-scheme: dark; }
  :global(body) { font-family: ui-sans-serif, system-ui; background: #0f172a; color: #e2e8f0; margin: 0; }
  main { padding: 24px; max-width: 720px; margin: 0 auto; }
  h1 { font-size: 28px; margin: 0 0 8px; }
  p { font-size: 18px; color: #ff3e00; }
</style>
`,
          },
        ],
      },
      {
        id: 'fw-angular',
        title: 'Angular',
        subtitle: 'Pipe `timeGuardLiveFormat` + Standalone API',
        description:
          'Usa el pipe optimizado `timeGuardLiveFormat` que corre fuera de NgZone para evitar Change Detection innecesario. Configuración global vía `TIME_GUARD_CONFIG`.',
        examples: [
          {
            title: 'Angular · AppComponent standalone',
            description:
              'Componente standalone con pipe live + configuración global.',
            code: `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TimeGuardLiveFormatPipe,
  TIME_GUARD_CONFIG,
} from '@bereasoftware/time-guard/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TimeGuardLiveFormatPipe],
  providers: [
    { provide: TIME_GUARD_CONFIG, useValue: { locale: 'es' } },
  ],
  styles: [\`
    :host { display: block; padding: 24px; max-width: 720px; margin: 0 auto;
            font-family: ui-sans-serif, system-ui; background: #0f172a;
            color: #e2e8f0; min-height: 100vh; }
    h1 { font-size: 28px; margin: 0 0 8px; }
    p { font-size: 18px; color: #dd0031; }
  \`],
  template: \`
    <h1>{{ 'now' | timeGuardLiveFormat:'dddd, DD MMMM YYYY':1000 }}</h1>
    <p>{{ 'now' | timeGuardLiveFormat:'HH:mm:ss':1000 }}</p>
  \`,
})
export class AppComponent {}
`,
          },
        ],
      },
      {
        id: 'fw-solid-playground',
        title: 'SolidJS',
        subtitle: 'Wrapper oficial @bereasoftware/time-guard/solid + signals',
        description:
          'Usa el wrapper oficial `@bereasoftware/time-guard/solid` con signals que se limpian automáticamente. Aprovecha la reactividad granular de SolidJS.',
        examples: [
          {
            title: 'Solid · App.tsx completo',
            description: 'Signal + onMount/onCleanup idiomático.',
            code: `import { createSignal, onCleanup, onMount } from 'solid-js';
import { TimeGuard } from '@bereasoftware/time-guard';

export default function App() {
  const [now, setNow] = createSignal(TimeGuard.now().locale('es'));

  onMount(() => {
    const id = setInterval(() => setNow(TimeGuard.now().locale('es')), 1000);
    onCleanup(() => clearInterval(id));
  });

  return (
    <main style={{ padding: '24px', 'max-width': '720px', margin: '0 auto', 'font-family': 'ui-sans-serif, system-ui' }}>
      <h1 style={{ 'font-size': '28px', margin: '0 0 8px' }}>
        {now().format('dddd, DD MMMM YYYY')}
      </h1>
      <p style={{ 'font-size': '18px', color: '#2c4f7c' }}>
        {now().format('HH:mm:ss')}
      </p>
    </main>
  );
}
`,
          },
        ],
      },
      {
        id: 'fw-qwik-playground',
        title: 'Qwik',
        subtitle: 'Wrapper oficial @bereasoftware/time-guard/qwik + signals',
        description:
          'Usa el wrapper oficial `@bereasoftware/time-guard/qwik` con signals y useVisibleTask$ para mantener el reloj actualizado sin penalizar el TTI.',
        examples: [
          {
            title: 'Qwik · App.tsx completo',
            description:
              'Signal + useVisibleTask$ + cleanup para evitar memory leaks.',
            code: `import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { TimeGuard } from '@bereasoftware/time-guard';

export default component$(() => {
  const iso = useSignal(TimeGuard.now().toISOString());

  useVisibleTask$(({ cleanup }) => {
    const id = setInterval(() => {
      iso.value = TimeGuard.now().toISOString();
    }, 1000);
    cleanup(() => clearInterval(id));
  });

  return (
    <main style="padding: 24px; max-width: 720px; margin: 0 auto; font-family: ui-sans-serif, system-ui;">
      <h1 style="font-size: 28px; margin: 0 0 8px;">
        {TimeGuard.from(iso.value).locale('es').format('dddd, DD MMMM YYYY')}
      </h1>
      <p style="font-size: 18px; color: #ac7ef4;">
        {TimeGuard.from(iso.value).locale('es').format('HH:mm:ss')}
      </p>
    </main>
  );
});
`,
          },
        ],
      },
    ],
  },
];
