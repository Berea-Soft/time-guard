import type { DocCategory } from '../types';

export const DOCS_DATA: DocCategory[] = [
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
const tomorrow = specific.add(1, 'day');
const lastMonth = specific.subtract(1, 'month');

console.log(specific.format('YYYY-MM-DD')); // "2026-05-20"
console.log(tomorrow.format('YYYY-MM-DD')); // "2026-05-21" (Nueva instancia)`,
          },
        ],
        playground: { enabled: true, mode: 'runner' },
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
        playground: { enabled: true, mode: 'runner' },
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
        playground: { enabled: true, mode: 'runner' },
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
        playground: { enabled: true, mode: 'runner' },
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
        playground: { enabled: true, mode: 'runner' },
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
        examples: [
          {
            title: 'Formateo con Locales Dinámicos',
            description:
              'Cambio dinámico del idioma de una instancia para formatear meses y días de la semana.',
            code: `import { TimeGuard } from '@bereasoftware/time-guard';

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
        ],
        playground: { enabled: true, mode: 'runner' },
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
        playground: { enabled: true, mode: 'runner' },
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
        playground: { enabled: true, mode: 'runner' },
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
        playground: { enabled: true, mode: 'runner' },
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
          'TimeGuard incluye soporte nativo para 6 sistemas de calendario a través del `CalendarManager`. Cada calendario implementa la interfaz `ICalendarSystem` con métodos para obtener nombres de meses/días, verificar años bisiestos y calcular días por mes/año. Puedes registrar calendarios personalizados fácilmente.',
        features: [
          'Gregoriano (gregory) — calendario ISO estándar internacional',
          'Islámico (islamic) — calendario Hijri para fechas islámicas',
          'Hebreo (hebrew) — calendario judío',
          'Chino (chinese) — calendario tradicional chino',
          'Japonés (japanese) — calendario imperial japonés',
          'Budista (buddhist) — calendario de la Era Budista',
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
console.log(gregory.daysInMonth(2026, 2));   // 28 (Febrero no bisiesto)`,
          },
        ],
        playground: { enabled: true, mode: 'runner' },
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
          'Mediante el `PluginManager`, puedes inyectar módulos avanzados a la clase principal de `TimeGuard`. Esto mantiene el core súper ligero (~5KB gzipped) y carga características pesadas solo si tu aplicación las requiere.',
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
// Output: "hace 1 hora y media"`,
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
        playground: { enabled: true, mode: 'runner', exampleIndex: 0 },
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
        examples: [],
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
        examples: [],
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
        examples: [],
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
        playground: { enabled: true, mode: 'app', framework: 'vanilla' },
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
        playground: { enabled: true, mode: 'app', framework: 'vue' },
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
        playground: { enabled: true, mode: 'app', framework: 'react' },
      },
      {
        id: 'fw-svelte',
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
        playground: { enabled: true, mode: 'app', framework: 'svelte' },
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
        playground: { enabled: true, mode: 'app', framework: 'angular' },
      },
      {
        id: 'fw-solid',
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
        playground: { enabled: true, mode: 'app', framework: 'solid' },
      },
      {
        id: 'fw-qwik',
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
        playground: { enabled: true, mode: 'app', framework: 'qwik' },
      },
    ],
  },
];
