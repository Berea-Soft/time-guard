# TimeGuard 🕐

> 📚 **Documentación disponible en otros idiomas:**
>
> - 🇪🇸 **Español** (este archivo - README.md)
> - 🇬🇧 [English](README.en.md)

Una biblioteca moderna y de nivel producción para manipulación de fechas/horas construida con **TypeScript**, **Temporal API** y **SOLID principles**. TimeGuard aprovecha los estándares de JavaScript modernos y las mejores prácticas.

[![Pruebas](https://img.shields.io/badge/Pruebas-530%2B-green?style=for-the-badge)](#testing)
[![Locales](https://img.shields.io/badge/Locales-40%2B-orange?style=for-the-badge)](#locales-soportadas)
[![Calendarios](https://img.shields.io/badge/Calendarios-6+-blue?style=for-the-badge)](#sistemas-de-calendario)
[![Versión NPM](https://img.shields.io/npm/v/@bereasoftware/time-guard?style=for-the-badge)](https://www.npmjs.com/package/@bereasoftware/time-guard)
[![Tamaño bundle](https://img.shields.io/bundlephobia/minzip/@bereasoftware/time-guard?style=for-the-badge)](https://www.npmjs.com/package/@bereasoftware/time-guard)
[![Descargas NPM](https://img.shields.io/npm/dm/@bereasoftware/time-guard?style=for-the-badge)](https://www.npmjs.com/package/@bereasoftware/time-guard)
[![CI](https://img.shields.io/github/actions/workflow/status/Berea-Soft/time-guard/ci.yml?style=for-the-badge)](https://github.com/Berea-Soft/time-guard/actions/workflows/ci.yml)
[![Node](https://img.shields.io/node/v/@bereasoftware/time-guard?style=for-the-badge)](https://www.npmjs.com/package/@bereasoftware/time-guard)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge)](https://www.typescriptlang.org/)
[![Licencia](https://img.shields.io/github/license/Berea-Soft/email-validator?style=for-the-badge)](https://github.com/Berea-Soft/email-validator/blob/main/LICENSE)
[![Último commit](https://img.shields.io/github/last-commit/Berea-Soft/time-guard?style=for-the-badge)](https://github.com/Berea-Soft/time-guard/commits/main)
[![Repositorio](https://img.shields.io/badge/github-repo-blue?logo=github&style=for-the-badge)](https://github.com/Berea-Soft/time-guard)
[![Cobertura](https://img.shields.io/badge/coverage-95%25-orange?style=for-the-badge)](https://github.com/Berea-Soft/time-guard)

---

## 🎯 Características

- ✨ **JavaScript Moderno** - Construido sobre Temporal API (estándar TC39)
- 🏛️ **Principios SOLID** - Arquitectura limpia, mantenible y extensible
- 🌍 **40+ Locales** - Soporte completo de internacionalización
- 📦 **TypeScript** - Seguridad de tipos completa con modo estricto
- 🧪 **530+ Tests** - Cobertura completa BDD/TDD
- 🎨 **Múltiples Formatos** - ISO, RFC2822, RFC3339, UTC y patrones personalizados
- ⚡ **Tree-Shakeable** - Estructura modular para tamaño óptimo del bundle
- 📚 **Bien Documentado** - Guías extensas, ejemplos y referencia API
- 🔌 **Sistema de Plugins** - Extiende con plugins opcionales (tiempo relativo, duración, formato avanzado)
- 📅 **Múltiples Calendarios** - Gregoriano, Islámico, Hebreo, Chino, Japonés, Budista y más
- ⏱️ **Precisión de Nanosegundos** - Soporte completo de Temporal API
- 🔄 **API de Duración** - Métodos `until()` y `round()` para cálculos avanzados

---

## 📋 Tabla de Contenidos

- [Inicio Rápido](#inicio-rápido)
- [Instalación](#instalación)
- [Conceptos Clave](#conceptos-clave)
- [Accesores de Componentes](#accesores-de-componentes)
- [Cálculos Avanzados](#cálculos-avanzados)
- [Sistemas de Calendario](#sistemas-de-calendario)
- [Plugins](#plugins)
- [Documentación](#documentación)
- [Locales Soportadas](#locales-soportadas)
- [Referencia API](#referencia-api)
- [Testing](#testing)
- [Arquitectura](#arquitectura)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

---

## 🚀 Inicio Rápido

```typescript
import { TimeGuard } from "@bereasoftware/time-guard";

// Crear una fecha
const now = TimeGuard.now();
const date = TimeGuard.from("2024-03-13");

// Manipular fechas
const tomorrow = date.add(1, "day");
const nextMonth = date.add(1, "month");

// Formatear con locales
const spanish = date.locale("es").format("dddd, DD MMMM YYYY");
// Resultado: miércoles, 13 marzo 2024

const japanese = date.locale("ja").format("YYYY年M月D日");
// Resultado: 2024年3月13日

// Obtener componentes
console.log(date.year()); // 2024
console.log(date.month()); // 3
console.log(date.day()); // 13
console.log(date.dayOfWeek()); // 3 (miércoles)

// Comparar fechas
console.log(date.isBefore(tomorrow)); // true
console.log(date.isSame(date.clone())); // true
console.log(date.isAfter(new Date("2020-01-01"))); // true
```

---

## 📦 Instalación

```bash
npm install @bereasoftware/time-guard
# o
yarn add @bereasoftware/time-guard
# o
pnpm add @bereasoftware/time-guard
```

### Requisitos

- **Node.js** 20.18.0+ (soporte de Temporal API)
- **TypeScript** 5.0+ (opcional pero recomendado)
- **@js-temporal/polyfill** >=0.5.0 (peer dependency)

### Bundle Modular

TimeGuard usa una arquitectura modular inspirada en dayjs. El **core** pesa ~5KB gzip e incluye solo lo esencial (TimeGuard, formatter, EN/ES, Gregoriano). Locales, plugins y calendarios se cargan bajo demanda:

```typescript
// Core ligero (~5KB gzip) - solo EN/ES
import { TimeGuard } from "@bereasoftware/time-guard";

// Módulos bajo demanda
import { ALL_LOCALES } from "@bereasoftware/time-guard/locales";
import { IslamicCalendar } from "@bereasoftware/time-guard/calendars";
import relativeTimePlugin from "@bereasoftware/time-guard/plugins/relative-time";
import { Duration } from "@bereasoftware/time-guard/plugins/duration";
import advancedFormatPlugin from "@bereasoftware/time-guard/plugins/advanced-format";

// UMD para CDN / <script>
// <script src="unpkg.com/@bereasoftware/time-guard/dist/time-guard.umd.js"></script>
```

---

## 🏗️ Conceptos Clave

### 1. Inmutabilidad

Todas las instancias de TimeGuard son inmutables. Cada operación devuelve una nueva instancia:

```typescript
const date = TimeGuard.from("2024-03-13");
const modified = date.add(1, "day");

console.log(date.day()); // 13 (sin cambios)
console.log(modified.day()); // 14 (nueva instancia)
```

### 2. Soporte de Zonas Horarias

Maneja zonas horarias con soporte completo de Temporal API:

```typescript
const date = TimeGuard.from("2024-03-13 10:30:00");

// Set timezone
const inNYC = date.timezone("America/New_York");
const inTokyo = date.timezone("Asia/Tokyo");

console.log(inNYC.format("YYYY-MM-DD HH:mm:ss Z"));
console.log(inTokyo.format("YYYY-MM-DD HH:mm:ss Z"));
```

### 3. Localización

Soporte para 40+ idiomas y locales:

```typescript
const date = TimeGuard.from("2024-03-13");

date.locale("en").format("MMMM DD, YYYY"); // March 13, 2024
date.locale("es").format("DD MMMM YYYY"); // 13 marzo 2024
date.locale("fr").format("DD MMMM YYYY"); // 13 mars 2024
date.locale("de").format("DD. MMMM YYYY"); // 13. März 2024
date.locale("ja").format("YYYY年M月D日"); // 2024年3月13日
date.locale("zh-cn").format("YYYY年M月D日"); // 2024年3月13日
date.locale("ar").format("DD MMMM YYYY"); // 13 مارس 2024
```

### 4. Estrategias de Formato

Múltiples formatos preestablecidos y patrones personalizados:

```typescript
const date = TimeGuard.from("2024-03-13 14:30:45");

// Preestablecidos
date.format("iso"); // 2024-03-13T14:30:45
date.format("date"); // 2024-03-13
date.format("time"); // 14:30:45
date.format("datetime"); // 2024-03-13 14:30:45
date.format("rfc2822"); // Wed, 13 Mar 2024 14:30:45 GMT
date.format("rfc3339"); // 2024-03-13T14:30:45Z
date.format("utc"); // 2024-03-13T14:30:45Z

// Patrones personalizados
date.format("YYYY-MM-DD HH:mm:ss");
date.format("dddd, MMMM DD, YYYY");
date.format("MM/DD/YYYY");
```

---

## 🎯 Accesores de Componentes

Acceso rápido a componentes individuales de la fecha:

```typescript
const date = TimeGuard.from("2024-03-13 14:30:45.123");

// Componentes individuales
console.log(date.year()); // 2024
console.log(date.month()); // 3
console.log(date.day()); // 13
console.log(date.hour()); // 14
console.log(date.minute()); // 30
console.log(date.second()); // 45
console.log(date.millisecond()); // 123

// Información de la semana
console.log(date.dayOfWeek()); // 3 (Mié: 1=Dom, 7=Sáb)
console.log(date.dayOfYear()); // 73
console.log(date.weekOfYear()); // 11

// Información de mes/año
console.log(date.daysInMonth()); // 31
console.log(date.daysInYear()); // 366 (año bisiesto)
console.log(date.inLeapYear()); // true
```

---

## ⏱️ Cálculos Avanzados

### Duración: Calcular tiempo entre fechas

```typescript
const start = TimeGuard.from("2024-01-15");
const end = TimeGuard.from("2024-03-20");

const duration = start.until(end);

console.log(duration);
// {
//   years: 0,
//   months: 2,
//   days: 5,
//   hours: 0,
//   minutes: 0,
//   seconds: 0,
//   milliseconds: 0
// }
```

### Redondeo: Control de precisión

```typescript
const date = TimeGuard.from("2024-03-13 14:35:47.654");

// Redondear a diferentes unidades
date.round({ smallestUnit: "second" }); // 2024-03-13 14:35:48
date.round({ smallestUnit: "minute" }); // 2024-03-13 14:36:00
date.round({ smallestUnit: "hour" }); // 2024-03-13 15:00:00
date.round({ smallestUnit: "day" }); // 2024-03-14 00:00:00

// Modos de redondeo: 'ceil', 'floor', 'trunc', 'half' (predeterminado)
date.round({
  smallestUnit: "minute",
  roundingMode: "ceil",
});
```

---

## 📅 Sistemas de Calendario

TimeGuard incluye soporte para múltiples sistemas de calendario, extensible a través del gestor de calendarios:

### Calendarios Soportados

```typescript
import { TimeGuard, CalendarManager } from "@bereasoftware/time-guard";
import {
  IslamicCalendar,
  HebrewCalendar,
  ChineseCalendar,
  JapaneseCalendar,
  BuddhistCalendar,
} from "@bereasoftware/time-guard/calendars";

// Get calendar manager
const calendarMgr = CalendarManager.getInstance();

// List available calendars
console.log(calendarMgr.list());
// ['gregory', 'islamic', 'hebrew', 'chinese', 'japanese', 'buddhist']

// Register custom calendar
const islamic = new IslamicCalendar();
calendarMgr.register(islamic);

// Get calendar info
const gregorian = calendarMgr.get("gregory");
console.log(gregorian.getMonthName(3)); // "March"
console.log(gregorian.getMonthName(3, true)); // "Mar"
console.log(gregorian.getWeekdayName(1)); // "Sunday"
console.log(gregorian.isLeapYear(2024)); // true
```

### Objetos de Calendario

#### Calendario Gregoriano

```typescript
import { GregorianCalendar } from "@bereasoftware/time-guard/calendars";

const calendar = new GregorianCalendar();
console.log(calendar.daysInMonth(2024, 2)); // 29 (leap year)
console.log(calendar.daysInYear(2024)); // 366
```

#### Calendario Islámico (Hijri)

```typescript
import { IslamicCalendar } from "@bereasoftware/time-guard/calendars";

const calendar = new IslamicCalendar();
console.log(calendar.getMonthName(9)); // "Ramadan"
console.log(calendar.isLeapYear(1445)); // true
```

#### Calendario Hebreo

```typescript
import { HebrewCalendar } from "@bereasoftware/time-guard/calendars";

const calendar = new HebrewCalendar();
console.log(calendar.getMonthName(1)); // "Tishrei"
console.log(calendar.isLeapYear(5784)); // true
```

#### Calendario Chino

```typescript
import { ChineseCalendar } from "@bereasoftware/time-guard/calendars";

const calendar = new ChineseCalendar();
const zodiac = calendar.getZodiacSign(2024); // "龙" (Dragon)
```

#### Calendario Japonés

```typescript
import { JapaneseCalendar } from "@bereasoftware/time-guard/calendars";

const calendar = new JapaneseCalendar();
console.log(calendar.getMonthName(3)); // "3月"
```

#### Calendario Budista

```typescript
import { BuddhistCalendar } from "@bereasoftware/time-guard/calendars";

const calendar = new BuddhistCalendar();
// Year 2567 BE = 2024 CE
console.log(calendar.isLeapYear(2567)); // true
```

---

## � Plugins

TimeGuard incluye un sistema de plugins opcional para funcionalidad extendida:

### Plugins Disponibles

1. **Plugin de Tiempo Relativo** - Diferencias de tiempo legibles para humanos

   ```typescript
   import { TimeGuard, PluginManager } from "@bereasoftware/time-guard";
   import relativeTimePlugin from "@bereasoftware/time-guard/plugins/relative-time";

   PluginManager.use(relativeTimePlugin, TimeGuard);

   TimeGuard.from("2024-01-01").fromNow(); // "2 months ago"
   TimeGuard.from("2024-04-01").toNow(); // "in 19 days"
   ```

2. **Plugin de Duración** - Soporte de duración ISO 8601

   ```typescript
   import { Duration } from "@bereasoftware/time-guard/plugins/duration";

   const duration = Duration.fromISO("P2Y3M4D");
   duration.humanize(); // "2 years, 3 months, 4 days"
   duration.asDays(); // 1159
   ```

3. **Plugin de Formato Avanzado** - Tokens de formato extendidos

   ```typescript
   import advancedFormatPlugin from "@bereasoftware/time-guard/plugins/advanced-format";

   PluginManager.use(advancedFormatPlugin, TimeGuard);

   date.format("Do MMMM YYYY"); // "13th March 2024"
   date.format("Q [Q] YYYY"); // "1 Q 2024"
   ```

**📖 Full Details:** See [PLUGINS.md](PLUGINS.md) for complete plugin documentation.

---

## �📚 Documentation

### Archivos de Documentación Principal

| Documento                             | Propósito                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [📖 ARCHITECTURE.md](ARCHITECTURE.md) | Deep dive into design patterns, SOLID principles, and system architecture | Inmersión profunda en patrones de diseño, principios SOLID y arquitectura |
| [💡 EXAMPLES.md](EXAMPLES.md)         | Real-world usage examples and common scenarios                            |
| [🌍 LOCALES.md](LOCALES.md)           | Complete guide to localization and supported languages                    |
| [� PLUGINS.md](PLUGINS.md)            | Plugin system documentation and usage guide                               |
| [�📖 API Reference](#api-overview)    | Quick API reference (below)                                               |

### Navegación Rápida

- **Inicio** → Comienza con [Inicio Rápido](#inicio-r%C3%A1pido) arriba
- **Uso Avanzado** → Ver [EXAMPLES.md](EXAMPLES.md)
- **Localización** → Ver [LOCALES.md](LOCALES.md)
- **Arquitectura** → Ver [ARCHITECTURE.md](ARCHITECTURE.md)

## 🌍 Locales Soportadas

TimeGuard proporciona **más de 40 idiomas y variantes regionales** con soporte completo de internacionalización. Los locales se organizan por familia de idiomas para facilitar el descubrimiento.

### Formato de Código de Locale

Los códigos de locale siguen el patrón estándar `[language]-[region]`:

- `en` - Forma predeterminada (se usa si no se especifica variante de región)
- `en-gb` - Variante de región específica (Gran Bretaña)
- `es-mx` - Variante española para México
- `zh-cn` - Chino simplificado

### Locales Disponibles por Familia

####-🇬🇧 Inglés (4 variantes)

- `en` - Inglés (US)
- `en-au` - Inglés (Australia)
- `en-gb` - Inglés (Gran Bretaña)
- `en-ca` - Inglés (Canadá)

### Español (3 variantes)

- `es` - Español (España)
- `es-mx` - Español (México)
- `es-us` - Español (US)

### Idiomas Románicos (5)

- `fr` - Francés
- `it` - Italiano
- `pt` - Portugués (Portugal)
- `pt-br` - Portugués (Brasil)
- `ro` - Rumano

### Idiomas Eslavos (4)

- `ru` - Ruso
- `pl` - Polaco
- `cs` - Checo
- `sk` - Eslovaco

### Idiomas Nórdicos (4)

- `sv` - Sueco
- `nb` - Noruego (Bokmål)
- `da` - Danés
- `fi` - Finlandés

### Idiomas Asiáticos (7)

- `ja` - Japonés
- `zh-cn` - Chino (Simplificado)
- `zh-tw` - Chino (Tradicional)
- `ko` - Coreano
- `th` - Thai
- `vi` - Vietnamita
- `id` - Indonesio

### Idiomas Europeos (7)

- `de` - Alemán
- `nl` - Holandés
- `el` - Griego
- `hu` - Húngaro
- `eu` - Euskera
- `ca` - Catalán
- `tr` - Turco

### Oriente Medio y Asia del Sur (3)

- `ar` - Árabe
- `he` - Hebreo
- `hi` - Hindi

---

### Guía de Uso de Locales

#### Configuración de Locales

```typescript
import { TimeGuard } from "@bereasoftware/time-guard";

const date = TimeGuard.from("2024-03-13 14:30:00");

// Get current locale
const currentLocale = date.locale(); // "en"

// Change locale (returns new instance)
const spanish = date.locale("es");
const french = date.locale("fr");
const japanese = date.locale("ja");
const arabic = date.locale("ar");

// Chain operations
date.locale("es").format("dddd, DD MMMM YYYY"); // miércoles, 13 marzo 2024

// Or use constructor config
TimeGuard.from("2024-03-13", { locale: "de" });
TimeGuard.now({ locale: "ja" });
```

#### Formateo en Diferentes Locales

```typescript
const date = TimeGuard.from("2024-03-13");

// English variants
date.locale("en").format("MMMM DD, YYYY"); // March 13, 2024
date.locale("en-gb").format("DD MMMM YYYY"); // 13 March 2024
date.locale("en-au").format("DD/MM/YYYY"); // 13/03/2024
date.locale("en-ca").format("YYYY-MM-DD"); // 2024-03-13

// Spanish variants
date.locale("es").format("DD MMMM YYYY"); // 13 marzo 2024
date.locale("es-mx").format("DD/MM/YYYY"); // 13/03/2024
date.locale("es-us").format("MMMM D"); // marzo 13

// Romance languages
date.locale("fr").format("dddd D MMMM YYYY"); // mercredi 13 mars 2024
date.locale("it").format("dddd, D MMMM YYYY"); // mercoledì, 13 marzo 2024
date.locale("pt").format("dddd, D MMMM YYYY"); // quarta-feira, 13 de março de 2024
date.locale("pt-br").format("DD/MM/YYYY"); // 13/03/2024
date.locale("ro").format("DD MMMM YYYY"); // 13 martie 2024

// Slavic languages
date.locale("ru").format("DD MMMM YYYY"); // 13 марта 2024
date.locale("pl").format("DD MMMM YYYY"); // 13 marca 2024
date.locale("cs").format("DD. MMMM YYYY"); // 13. března 2024
date.locale("sk").format("DD. MMMM YYYY"); // 13. marca 2024

// Nordic languages
date.locale("sv").format("DD MMMM YYYY"); // 13 mars 2024
date.locale("nb").format("DD. MMMM YYYY"); // 13. mars 2024
date.locale("da").format("DD. MMMM YYYY"); // 13. marts 2024
date.locale("fi").format("DD. MMMM YYYY"); // 13. maaliskuuta 2024

// Asian languages
date.locale("ja").format("YYYY年M月D日"); // 2024年3月13日
date.locale("zh-cn").format("YYYY年M月D日"); // 2024年3月13日
date.locale("zh-tw").format("YYYY年M月D日"); // 2024年3月13日
date.locale("ko").format("YYYY년 M월 D일"); // 2024년 3월 13일
date.locale("th").format("DD MMMM YYYY"); // 13 มีนาคม 2567 (BE)
date.locale("vi").format("DD/MM/YYYY"); // 13/03/2024
date.locale("id").format("DD MMMM YYYY"); // 13 Maret 2024

// European languages
date.locale("de").format("DD. MMMM YYYY"); // 13. März 2024
date.locale("nl").format("DD MMMM YYYY"); // 13 maart 2024
date.locale("el").format("DD MMMM YYYY"); // 13 Μαρτίου 2024
date.locale("hu").format("YYYY. MMMM DD."); // 2024. március 13.
date.locale("eu").format("YYYY[ko] MMMM[ren] DD"); // 2024ko martsaren 13
date.locale("ca").format("DD MMMM YYYY"); // 13 de març de 2024
date.locale("tr").format("DD MMMM YYYY"); // 13 Mart 2024

// Middle Eastern & South Asian
date.locale("ar").format("DD MMMM YYYY"); // 13 مارس 2024
date.locale("he").format("DD.MM.YYYY"); // 13.03.2024
date.locale("hi").format("DD MMMM YYYY"); // 13 मार्च 2024
```

#### Nombres de Día y Mes

```typescript
// Get localized day names
date.locale("es").format("dddd"); // miércoles
date.locale("es").format("ddd"); // mié
date.locale("fr").format("dddd"); // mercredi
date.locale("de").format("dddd"); // Mittwoch
date.locale("ja").format("dddd"); // 水曜日

// Get localized month names
date.locale("es").format("MMMM"); // marzo
date.locale("es").format("MMM"); // mar
date.locale("fr").format("MMMM"); // mars
date.locale("de").format("MMMM"); // März
date.locale("ru").format("MMMM"); // марта
```

#### Aplicaciones Multilocale

```typescript
// Switch language at runtime (user preference)
let currentLocale = "en";

function formatUserDate(
  date: TimeGuard,
  locale: string = currentLocale,
): string {
  return date.locale(locale).format("dddd, MMMM D, YYYY [at] HH:mm");
}

const date = TimeGuard.now();

// English user
console.log(formatUserDate(date, "en")); // Wednesday, March 13, 2024 at 14:30

// Spanish user
currentLocale = "es";
console.log(formatUserDate(date, "es")); // miércoles, 13 de marzo de 2024 a las 14:30

// French user
console.log(formatUserDate(date, "fr")); // mercredi, 13 mars 2024 à 14:30

// Japanese user
console.log(formatUserDate(date, "ja")); // 水曜日、2024年3月13日 14:30
```

#### Obtener Locales Disponibles Programáticamente

```typescript
// Get all available locales
const locales = TimeGuard.getAvailableLocales();
// Returns: ['en', 'en-au', 'en-gb', 'en-ca', 'es', 'es-mx', 'es-us', ...]

// Filter by prefix
const englishLocales = locales.filter((l) => l.startsWith("en"));
const spanishLocales = locales.filter((l) => l.startsWith("es"));
const asianLocales = locales.filter((l) =>
  ["ja", "zh-cn", "zh-tw", "ko"].includes(l),
);

// Create locale selector UI
function createLocaleSelector() {
  const locales = TimeGuard.getAvailableLocales();
  return locales.map((locale) => ({
    code: locale,
    label: new Intl.DisplayNames("en", { type: "language" }).of(locale),
  }));
}
```

**📖 Full Details:** See [LOCALES.md](LOCALES.md) for locale-specific usage and characteristics.

---

## 🔌 Plugins - Complete Guide

TimeGuard includes a powerful plugin system for extending functionality. Plugins follow SOLID principles and are fully optional.

### Plugin Manager

```typescript
import { TimeGuard, PluginManager } from "@bereasoftware/time-guard";

// Use a plugin
PluginManager.use(myPlugin, TimeGuard);

// Check if plugin is installed
PluginManager.isInstalled(pluginName);

// List installed plugins
PluginManager.listInstalled();
```

### 1️⃣ Plugin de Tiempo Relativo

Añade diferencias de tiempo legibles como "hace 2 horas" o "en 3 días".

```typescript
import { TimeGuard, PluginManager } from "@bereasoftware/time-guard";
import relativeTimePlugin from "@bereasoftware/time-guard/plugins/relative-time";

// Install plugin once
PluginManager.use(relativeTimePlugin, TimeGuard);

// Now use relative time methods
const date = TimeGuard.from("2024-01-15");

// Relative to now
date.fromNow(); // "2 months ago"
date.toNow(); // "in 2 months"

// Without suffix
date.fromNow(true); // "2 months"
date.toNow(true); // "2 months"

// Relative to another date
const other = TimeGuard.from("2024-02-15");
date.from(other); // "a month ago"
date.to(other); // "in a month"

// Humanize duration
date.humanize(other); // "a month"
date.humanize(other, true); // "a month" (exact mode)
```

**Supported Relative Time Formats:**

```
"a few seconds ago"             // Very recent
"a minute ago" / "2 minutes ago"
"an hour ago" / "3 hours ago"
"a day ago" / "5 days ago"
"a month ago" / "2 months ago"
"a year ago" / "3 years ago"
"in a few seconds"              // Future
"in a minute" / "in 2 minutes"
"in an hour" / "in 3 hours"
"in a day" / "in 5 days"
"in a month" / "in 2 months"
"in a year" / "in 3 years"
```

---

### 2️⃣ Plugin de Duración

Soporte de duración ISO 8601 con cálculos avanzados.

```typescript
import { TimeGuard } from "@bereasoftware/time-guard";
import {
  Duration,
  durationPlugin,
} from "@bereasoftware/time-guard/plugins/duration";
import { PluginManager } from "@bereasoftware/time-guard";

// Install plugin
PluginManager.use(durationPlugin, TimeGuard);

// ===== Create Durations =====

// From object
const duration1 = new Duration({
  years: 2,
  months: 3,
  days: 4,
  hours: 12,
  minutes: 30,
});

// From ISO 8601 string
const duration2 = Duration.fromISO("P3Y6M4DT12H30M5S");
// P = Period marker
// 3Y = 3 years
// 6M = 6 months
// 4D = 4 days
// T = Time marker
// 12H = 12 hours
// 30M = 30 minutes
// 5S = 5 seconds

// From TimeGuard dates
const start = TimeGuard.from("2024-01-15");
const end = TimeGuard.from("2024-05-20");
const between = Duration.between(start, end);
// { years: 0, months: 4, days: 5, ... }

// ===== Duration Operations =====

// Get ISO string
duration1.toISO(); // "P2Y3M4DT12H30M"

// Get total in different units
duration1.asDays(); // Total days
duration1.asHours(); // Total hours
duration1.asSeconds(); // Total seconds
duration1.asMilliseconds(); // Total milliseconds

// Humanize
duration1.humanize(); // "2 years, 3 months, 4 days, 12 hours, 30 minutes"
duration1.humanize("es"); // Spanish: "2 años, 3 meses..."
duration1.humanize("fr"); // French: "2 ans, 3 mois..."

// Get components
duration1.years;
duration1.months;
duration1.days;
duration1.hours;
duration1.minutes;
duration1.seconds;
duration1.milliseconds;

// Clone
const copy = duration1.clone();

// Arithmetic
duration1.add(new Duration({ days: 5 }));
duration1.subtract(new Duration({ hours: 2 }));
duration1.multiply(2); // Double the duration
duration1.negate(); // Reverse direction
```

**ISO 8601 Duration Examples:**

```typescript
Duration.fromISO("P1Y"); // 1 year
Duration.fromISO("P3M"); // 3 months
Duration.fromISO("P1W"); // 1 week (7 days)
Duration.fromISO("P1D"); // 1 day
Duration.fromISO("PT1H"); // 1 hour
Duration.fromISO("PT30M"); // 30 minutes
Duration.fromISO("PT45S"); // 45 seconds
Duration.fromISO("P1Y2M3DT4H5M6S"); // Complex: 1 year, 2 months, ...
Duration.fromISO("-P1D"); // Negative: -1 day
```

---

### 3️⃣ Plugin de Formato Avanzado

Tokens de formato extendidos para necesidades de formateo especializadas.

```typescript
import { TimeGuard, PluginManager } from "@bereasoftware/time-guard";
import advancedFormatPlugin from "@bereasoftware/time-guard/plugins/advanced-format";

// Install plugin
PluginManager.use(advancedFormatPlugin, TimeGuard);

const date = TimeGuard.from("2024-03-13 14:30:00");

// Advanced tokens become available
date.format("Do MMMM YYYY"); // "13th March 2024"
date.format("Q [Q] YYYY"); // "1 Q 2024"
date.format("[Week] w, YYYY"); // "Week 11, 2024"
date.format("W [of] ww"); // "11 of 11"
date.format("gggg-[W]ww"); // "2024-W11" (ISO week)
date.format("GGGG-[W]WW"); // 2024-W11 (alternative)

// Timezone abbreviation
date.format("HH:mm zzz"); // "14:30 UTC"

// 24-hour (k = 1-24 instead of 0-23)
date.format("k:mm"); // "14:30"

// Unix timestamps
date.format("X"); // Unix seconds
date.format("x"); // Unix milliseconds
```

**Advanced Format Tokens:**

```
Q                               // Quarter (1, 2, 3, 4)
Do                              // Ordinal day (1st, 2nd, 3rd, etc.)
w                               // Week of year (no padding)
ww                              // Week of year (zero-padded)
W                               // ISO week number
gggg                            // ISO week year
GGGG                            // Alternative ISO week year
k / kk                          // 24-hour format (1-24)
X                               // Unix seconds
x                               // Unix milliseconds
zzz                             // Timezone abbreviation (UTC, EST, etc.)
```

---

### Arquitectura de Plugins

All plugins implement `ITimeGuardPlugin`:

```typescript
interface ITimeGuardPlugin {
  name: string;
  version: string;
  install(TimeGuardClass: typeof TimeGuard): void;
}
```

### Creating Custom Plugins

```typescript
import { TimeGuard } from "@bereasoftware/time-guard";
import type { ITimeGuardPlugin } from "@bereasoftware/time-guard/types";

class MyCustomPlugin implements ITimeGuardPlugin {
  name = "my-plugin";
  version = "1.0.0";

  install(TimeGuardClass: typeof TimeGuard): void {
    // Add method to TimeGuard prototype
    (TimeGuardClass.prototype as any).myMethod = function () {
      return "Hello from my plugin!";
    };
  }
}

// Use it
const plugin = new MyCustomPlugin();
PluginManager.use(plugin, TimeGuard);

// Now available
const date = TimeGuard.now();
date.myMethod(); // "Hello from my plugin!"
```

**📖 Full Plugin Details:** See [PLUGINS.md](PLUGINS.md) for extended documentation.

---

## 🎯 Referencia API

### Factory Methods

```typescript
// Create current date/time
TimeGuard.now();
TimeGuard.now({ locale: "es", timezone: "America/Mexico_City" });

// Create from various inputs
TimeGuard.from("2024-03-13");
TimeGuard.from("2024-03-13T14:30:00");
TimeGuard.from(new Date());
TimeGuard.from(1234567890000); // milliseconds
TimeGuard.from(1234567890, { timezone: "UTC" }); // seconds
TimeGuard.from("2024-03-13", { locale: "es" });

// Create from Temporal object
TimeGuard.fromTemporal(temporalPlainDateTime, config);
```

### 🔄 Conversion Methods

```typescript
const date = TimeGuard.from("2024-03-13 14:30:45");

date.toDate(); // Convert to JavaScript Date
date.toTemporal(); // Get underlying Temporal object
date.toISOString(); // ISO 8601: "2024-03-13T14:30:45Z"
date.toJSON(); // JSON serialization (ISO string)
date.toString(); // Human readable: "2024-03-13 14:30:45"

date.valueOf(); // Milliseconds since epoch
date.unix(); // Seconds since epoch
```

### ➕ Manipulation Methods

```typescript
const date = TimeGuard.from("2024-03-13 14:30:00");

// Add time - accepts partial record of units
date.add({ days: 5 });
date.add({ months: 1, days: 5 });
date.add({ years: 1, hours: 2, minutes: 30 });

// Subtract time - same syntax as add
date.subtract({ days: 5 });
date.subtract({ months: 1 });

// Set specific component(s)
date.set({ day: 15 }); // Keep other components
date.set({ hour: 10, minute: 0 });
date.set({ year: 2025, month: 1, day: 1 });

// Start/End of period
date.startOf("year"); // 2024-01-01 00:00:00
date.startOf("month"); // 2024-03-01 00:00:00
date.startOf("day"); // 2024-03-13 00:00:00
date.startOf("hour"); // 2024-03-13 14:00:00
date.endOf("year"); // 2024-12-31 23:59:59
date.endOf("month"); // 2024-03-31 23:59:59

date.clone(); // Create independent copy
```

### 🔍 Component Accessors (Getters)

```typescript
const date = TimeGuard.from("2024-03-13 14:30:45.123");

// Date components
date.year(); // 2024
date.month(); // 3 (January = 1, December = 12)
date.day(); // 13
date.quarter(); // 1 (Q1, Q2, Q3, or Q4)

// Time components
date.hour(); // 14
date.minute(); // 30
date.second(); // 45
date.millisecond(); // 123

// Week/Day information
date.dayOfWeek(); // 3 (1=Sunday, 7=Saturday)
date.dayOfYear(); // 73
date.weekOfYear(); // 11

// Month/Year information
date.daysInMonth(); // 31
date.daysInYear(); // 366 (leap year)
date.inLeapYear(); // true
```

### ⚖️ Comparison Methods

```typescript
const date1 = TimeGuard.from("2024-03-13");
const date2 = TimeGuard.from("2024-03-20");

// Direct comparison
date1.isBefore(date2); // true
date1.isAfter(date2); // false
date1.isSame(date1); // true

// Unit-specific comparison
date1.isSame(date2, "month"); // true (same month)
date1.isSame(date2, "year"); // true (same year)
date1.isSame(date2, "day"); // false (different day)

// Range checking
date1.isBetween(date1, date2); // true
date1.isBetween(date1, date2, undefined, "[]"); // inclusive both ends
date1.isBetween(date1, date2, undefined, "()"); // exclusive both ends
date1.isBetween(date1, date2, "month", "[]"); // granular range

// Calculate difference
date1.diff(date2, "days"); // -7
date1.diff(date2, "millisecond"); // difference in ms
date1.diff(date2, "months"); // -0
```

### 📊 Advanced Calculations

```typescript
const date = TimeGuard.from("2024-01-15");
const future = TimeGuard.from("2024-05-20");

// Duration: Get complete breakdown
const duration = date.until(future);
// { years: 0, months: 4, days: 5, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }

// Rounding: Precision control
date.round({ smallestUnit: "millisecond" }); // Default, no change
date.round({ smallestUnit: "second" }); // Removes milliseconds
date.round({ smallestUnit: "minute" }); // 2024-03-13 14:30:00
date.round({ smallestUnit: "hour" }); // 2024-03-13 14:00:00
date.round({ smallestUnit: "day" }); // 2024-03-13 00:00:00

// Rounding modes
date.round({
  smallestUnit: "minute",
  roundingMode: "halfExpand", // Default: round to nearest
});

date.round({
  smallestUnit: "minute",
  roundingMode: "ceil", // Always round up
});
```

### 🌍 Locale & Timezone

```typescript
const date = TimeGuard.from("2024-03-13 14:30:00");

// Get/Set locale
date.locale(); // Returns current locale: 'en'
date.locale("es"); // Set locale, returns new instance

// Format in different locales
date.format("YYYY-MM-DD"); // 2024-03-13
date.locale("es").format("DD MMMM YYYY"); // 13 marzo 2024
date.locale("es-mx").format("DD/MM/YYYY"); // 13/03/2024
date.locale("fr").format("dddd, DD MMMM YYYY"); // mercredi, 13 mars 2024
date.locale("de").format("DD. MMMM YYYY"); // 13. März 2024
date.locale("ja").format("YYYY年M月D日"); // 2024年3月13日
date.locale("zh-cn").format("YYYY年M月D日"); // 2024年3月13日
date.locale("ar").format("DD MMMM YYYY"); // 13 مارس 2024

// Get/Set timezone
date.timezone(); // Returns current timezone: 'UTC'
const inNYC = date.timezone("America/New_York");
const inTokyo = date.timezone("Asia/Tokyo");
const inDubai = date.timezone("Asia/Dubai");

// Format with timezone info
inNYC.format("YYYY-MM-DD HH:mm:ss Z"); // 2024-03-13 10:30:00 -04:00
inTokyo.format("YYYY-MM-DD HH:mm:ss Z"); // 2024-03-13 23:30:00 +09:00

// Get all available locales
TimeGuard.getAvailableLocales(); // Array of 40+ locale codes
```

### 🎨 Format Patterns

#### Format Presets

```typescript
const date = TimeGuard.from("2024-03-13 14:30:45.123");

// Built-in presets
date.format("iso"); // 2024-03-13T14:30:45.123Z
date.format("date"); // 2024-03-13
date.format("time"); // 14:30:45
date.format("datetime"); // 2024-03-13 14:30:45
date.format("rfc2822"); // Wed, 13 Mar 2024 14:30:45 +0000
date.format("rfc3339"); // 2024-03-13T14:30:45Z
date.format("utc"); // 2024-03-13T14:30:45.123Z
```

#### Format Tokens

```typescript
// Year
'YYYY'                          // 2024 (4-digit)
'YY'                            // 24 (2-digit)

// Month
'MMMM'                          // March
'MMM'                           // Mar
'MM'                            // 03 (zero-padded)
'M'                             // 3 (no padding)

// Day
'DDDD' or 'DDD'                 // Monday (full day name)
'ddd'                           // Mon (abbreviated)
'DD'                            // 13 (zero-padded)
'D'                             // 13 (no padding)

// Hours, minutes, seconds
'HH'                            // 14 (24-hour, zero-padded)
'H'                             // 14
'hh'                            // 02 (12-hour, zero-padded)
'h'                             // 2
'mm'                            // 30
'm'                             // 30
'ss'                            // 45
's'                             // 45
'A'                             // AM or PM
'a'                             // am or pm

// Milliseconds & Week
'SSS'                           // 123 (milliseconds)
'SS'                            // 12
'S'                             // 1
'ww'                            // 11 (week with padding)
'w'                             // 11 (week no padding)

// Escaped text
'[text]'                        // Protects text: [UTC]
'"text"'                        // Alternative protection: "o'clock"
```

#### Custom Format Examples

```typescript
date.format("YYYY-MM-DD"); // 2024-03-13
date.format("DD/MM/YYYY"); // 13/03/2024
date.format("MMMM D, YYYY"); // March 13, 2024
date.format("dddd, MMMM D, YYYY"); // Wednesday, March 13, 2024
date.format("DD-MMMM-YY"); // 13-Mar-24
date.format("h:mm A"); // 2:30 PM
date.format("HH:mm:ss"); // 14:30:45
date.format("[Today is] dddd"); // Today is Wednesday
date.format("HH:mm [UTC]"); // 14:30 UTC
date.format('DD/MM/YYYY "at" HH:mm'); // 13/03/2024 at 14:30
```

**📖 Complete Format Guide:** See [EXAMPLES.md](EXAMPLES.md) for more patterns and use cases.

---

## 🧪 Testing

TimeGuard includes **530+ comprehensive tests** covering:

- ✅ Core functionality (creation, manipulation, querying)
- ✅ Advanced features (timezones, locales, formatting)
- ✅ Edge cases (leap years, month boundaries, DST)
- ✅ SOLID principle validation
- ✅ Type safety verification

### Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- locales.test.ts

# Watch mode
npm test -- --watch
```

### Test Coverage

```
Core functionality:        65+ tests
Advanced features:        50+ tests
Locale support:          100+ tests
Integration scenarios:   250+ tests
Edge cases:              65+ tests
```

---

## 🏛️ Arquitectura

TimeGuard is built on **SOLID principles** ensuring clean, maintainable, and extensible code:

### Key Principles

- **Single Responsibility** - Each class has one reason to change
- **Open/Closed** - Open for extension, closed for modification
- **Liskov Substitution** - Proper interface contracts
- **Interface Segregation** - Minimal, focused interfaces
- **Dependency Inversion** - Depend on abstractions, not concretions

### Design Patterns

- **Factory Pattern** - Date creation and parsing
- **Adapter Pattern** - Temporal API abstraction
- **Strategy Pattern** - Multiple formatting strategies
- **Singleton Pattern** - Locale manager
- **Facade Pattern** - Simple public API
- **Immutable Pattern** - Safe data handling

**📖 Deep Dive:** See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed architecture explanation.

---

## 🔧 Development

### Build

```bash
# Build for production
npm run build

# Watch mode for development
npm run dev
```

### Estructura del Proyecto

```
time-guard/
├── src/
│   ├── index.ts                 # Core ligero (~5KB gzip, EN/ES)
│   ├── polyfill-loader.ts       # Cargador del polyfill Temporal
│   ├── time-guard.ts            # Clase principal
│   ├── adapters/
│   │   └── temporal.adapter.ts  # Wrapper del API Temporal
│   ├── calendars/               # 6 sistemas de calendario
│   ├── formatters/
│   │   └── date.formatter.ts    # Estrategias de formateo
│   ├── locales/                 # 40+ archivos de locale
│   ├── plugins/                 # 3 plugins (relative-time, duration, advanced-format)
│   └── types/                   # Definiciones de tipos
├── test/
│   ├── time-guard.test.ts       # Pruebas core
│   ├── advanced.test.ts         # Pruebas avanzadas
│   ├── comprehensive.test.ts    # Pruebas de integración
│   ├── locales.test.ts          # Pruebas de locales
│   ├── plugins.test.ts          # Pruebas de plugins
│   └── bundle-size.test.ts      # Validación de tamaño de bundle
└── vite.config.ts               # Config unificada (3 modos de build)
```

---

## 🤝 Contribuir

¡Bienvenidas las contribuciones! Por favor:

1. Sigue los principios SOLID y patrones de código existentes
2. Escribe pruebas para nuevas funcionalidades
3. Actualiza la documentación
4. Asegúrate de que todas las pruebas pasen (`npm test`)
5. Verifica que los tipos pasen (`npx tsc --noEmit`)

---

## 📄 Licencia

Licencia MIT © 2024 Berea-Soft

Ver archivo [LICENSE](LICENSE) para detalles.

---

## 🔗 Enlaces Rápidos

- 📖 [Referencia API Completa](EXAMPLES.md)
- 🏛️ [Guía de Arquitectura](ARCHITECTURE.md)
- 🌍 [Guía de Localización](LOCALES.md)
- 🐛 [Rastreador de Problemas](https://github.com/bereasoftware/time-guard/issues)
- 💬 [Discusiones](https://github.com/bereasoftware/time-guard/discussions)

---

## 🤝 Contribuidores

¡Gracias a todos los que han contribuido!

<a href="https://github.com/Berea-Soft/time-guard/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Berea-Soft/time-guard" alt="contribuidores" />
</a>

---

## 📞 Soporte

Para preguntas, problemas o solicitudes de funciones:

- Abre un problema en GitHub
- Inicia una discusión
- Consulta la documentación existente

---

Construído con ❤️ por Berea-Soft

Una librería moderna de fecha/hora con principios SOLID y TypeScript
