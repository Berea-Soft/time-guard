# TimeGuard - Librería Moderna de Fecha/Hora

> 📚 **Documentación disponible en otros idiomas:**
>
> 🇪🇸 **Español** (este archivo) | 🇬🇧 [English](ARCHITECTURE.en.md)

Una librería moderna y completamente tipada en TypeScript para manejo de fecha/hora, construida usando la **API Temporal**, siguiendo principios **SOLID** y diseñada con metodología **TDD/BDD**.

## 🎯 Características

- ✨ **TypeScript Completo** - Seguridad de tipos completa con modo estricto
- 🕐 **API Temporal** - Usa el nuevo API Temporal de JavaScript para manejo preciso de fecha/hora
- 🏗️ **Arquitectura SOLID** - Código limpio, mantenible y extensible
- 🧪 **Pruebas TDD/BDD** - Suite completa de pruebas con Vitest
- 🌍 **Soporte i18n** - Gestión de locales integrada (EN, ES, y extensible)
- 🔄 **Inmutable** - Todas las operaciones devuelven nuevas instancias
- 🪝 **Sistema de Plugins** - Extiende funcionalidad con plugins personalizados
- 📦 **Cero Dependencias** - Sin dependencias externas requeridas

## 📦 Instalación

```bash
npm install @bereasoftware/time-guard
```

## 🚀 Inicio Rápido

```typescript
import { TimeGuard, timeGuard } from '@bereasoftware/time-guard';

// Crear instancia
const now = TimeGuard.now();
const date = new TimeGuard('2024-03-13');
const aliased = timeGuard('2024-03-13');

// Formatear
date.format('YYYY-MM-DD'); // "2024-03-13"
date.format('MMMM D, YYYY'); // "13 de Marzo de 2024"

// Aritmética
date.add({ day: 5 }).format('YYYY-MM-DD'); // "2024-03-18"
date.subtract({ month: 1 }).format('YYYY-MM-DD'); // "2024-02-13"

// Consultas
date.isBefore(new TimeGuard('2024-03-20')); // true
date.isAfter(new TimeGuard('2024-03-10')); // true

// Manipulación
date.startOf('month').format('YYYY-MM-DD'); // "2024-03-01"
date.endOf('year').format('YYYY-MM-DD'); // "2024-12-31"

// Encadenamiento
date
  .add({ month: 1 })
  .startOf('month')
  .format('YYYY-MM-DD'); // "2024-04-01"
```

## 🏛️ Arquitectura y Principios SOLID

### Principio de Responsabilidad Única (SRP)

Cada clase tiene una única responsabilidad bien definida:

```
├── TemporalAdapter      → Conversión del API Temporal
├── DateFormatter        → Lógica de formateo de fechas
├── LocaleManager        → Gestión de locales
└── TimeGuard            → Fachada principal y coordinación
```

### Principio Abierto/Cerrado (OCP)

TimeGuard está abierto a extensión a través de plugins:

```typescript
interface ITimeGuardPlugin {
  name: string;
  version: string;
  install(timeGuard: typeof TimeGuard, config?: unknown): void;
}
```

### Principio de Sustitución de Liskov (LSP)

Todos los objetos de fecha/hora implementan la interfaz `ITimeGuard` consistentemente:

```typescript
interface ITimeGuard
  extends IDateArithmetic,
    IDateQuery,
    IDateManipulation {
  // ... métodos requeridos
}
```

### Principio de Segregación de Interfaz (ISP)

Interfaces pequeñas y enfocadas en lugar de interfaces grandes:

```typescript
interface IDateArithmetic {
  add(units: Partial<Record<Unit, number>>): TimeGuard;
  subtract(units: Partial<Record<Unit, number>>): TimeGuard;
  diff(other: TimeGuard, unit: Unit): number;
}

interface IDateQuery {
  isBefore(other: TimeGuard): boolean;
  isAfter(other: TimeGuard): boolean;
  isSame(other: TimeGuard, unit?: Unit): boolean;
  isBetween(start: TimeGuard, end: TimeGuard, unit?: Unit, inclusivity?: '[)' | '()' | '[]' | '(]'): boolean;
}

interface IDateManipulation {
  clone(): TimeGuard;
  startOf(unit: Unit): TimeGuard;
  endOf(unit: Unit): TimeGuard;
  set(values: Partial<Record<Unit, number>>): TimeGuard;
}
```

### Principio de Inversión de Dependencias (DIP)

Depende de abstracciones, no de implementaciones concretas:

```typescript
// Los módulos de bajo nivel dependen de abstracciones
class TimeGuard implements ITimeGuard {
  private localeManager: LocaleManager; // Abstracción singleton
  private formatter: DateFormatter;    // Inyección de dependencias
  private temporal: Temporal.PlainDateTime | Temporal.ZonedDateTime;
}
```

## 🧪 Estrategia de Pruebas (TDD/BDD)

Las pruebas se organizan alrededor de comportamientos del usuario (estilo BDD):

```typescript
describe('TimeGuard - Funcionalidad Principal', () => {
  describe('Crear instancias', () => {
    it('debe crear una instancia de TimeGuard con la fecha actual cuando no se proporciona argumento', () => {
      const tg = new TimeGuard();
      expect(tg.toDate()).toBeInstanceOf(Date);
    });
  });

  describe('Formateo', () => {
    it('debe formatear con patrón YYYY-MM-DD', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45.123');
      expect(tg.format('YYYY-MM-DD')).toBe('2024-03-13');
    });
  });

  // ... más pruebas
});
```

### Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
npm run test

# Modo watch
npm run test:watch

# Reporte de cobertura
npm run test:coverage
```

## 📖 Referencia de API

### Crear Instancias

```typescript
// Fecha/hora actual
TimeGuard.now()

// Desde varias entradas
new TimeGuard('2024-03-13')
new TimeGuard(new Date())
new TimeGuard(1710340800000) // Timestamp Unix (ms)
new TimeGuard({ year: 2024, month: 3, day: 13 })

// Con configuración
new TimeGuard('2024-03-13', { locale: 'es', timezone: 'UTC' })

// Función factory
timeGuard('2024-03-13')
```

### Formateo

```typescript
const tg = new TimeGuard('2024-03-13T14:30:45');

// Patrones personalizados
tg.format('YYYY-MM-DD')           // "2024-03-13"
tg.format('DD/MM/YYYY')           // "13/03/2024"
tg.format('MMMM D, YYYY')         // "13 de Marzo de 2024"
tg.format('dddd')                 // "Miércoles"
tg.format('[Fecha: ]YYYY-MM-DD')  // "Fecha: 2024-03-13"

// Presets
tg.format('iso')       // ISO 8601
tg.format('date')      // Solo fecha
tg.format('time')      // Solo hora
tg.format('datetime')  // Fecha y hora
tg.format('rfc2822')   // RFC 2822
tg.format('utc')       // Formato UTC
```

### Operaciones Aritméticas

```typescript
const tg = new TimeGuard('2024-03-13');

tg.add({ day: 5 })
tg.add({ month: 1, day: 15 })
tg.add({ year: 1, hour: 5, minute: 30 })

tg.subtract({ day: 5 })
tg.subtract({ month: 1, year: 1 })

// Diferencia entre fechas
tg.diff(new TimeGuard('2024-03-20'), 'day')     // -7
tg.diff(new TimeGuard('2024-04-13'), 'month')   // -1
```

### Operaciones de Consulta

```typescript
const tg1 = new TimeGuard('2024-03-13');
const tg2 = new TimeGuard('2024-03-20');

tg1.isBefore(tg2)                              // true
tg1.isAfter(tg2)                               // false
tg1.isSame(tg1.clone())                        // true
tg1.isSame(tg2, 'month')                       // true

tg1.isBetween(
  new TimeGuard('2024-03-01'),
  new TimeGuard('2024-03-31')
)                                              // true
```

### Operaciones de Manipulación

```typescript
const tg = new TimeGuard('2024-03-13T14:30:45');

tg.clone()                         // Nueva instancia
tg.startOf('year')                 // 2024-01-01 00:00:00
tg.startOf('month')                // 2024-03-01 00:00:00
tg.startOf('day')                  // 2024-03-13 00:00:00

tg.endOf('year')                   // 2024-12-31 23:59:59
tg.endOf('month')                  // 2024-03-31 23:59:59

tg.set({ month: 12, day: 25 })     // 2024-12-25 14:30:45
tg.set({ hour: 0, minute: 0 })     // 2024-03-13 00:00:00
```

### Operaciones de Conversión

```typescript
const tg = new TimeGuard('2024-03-13T14:30:45');

tg.toDate()           // Objeto JavaScript Date
tg.toISOString()      // "2024-03-13T14:30:45Z"
tg.valueOf()          // Timestamp Unix (ms)
tg.unix()             // Timestamp Unix (segundos)
tg.toJSON()           // String compatible con JSON
tg.toString()         // "2024-03-13 14:30:45"
tg.toTemporal()       // Temporal.PlainDateTime
```

### Getters

```typescript
const tg = new TimeGuard('2024-03-13T14:30:45.123');

tg.get('year')         // 2024
tg.get('month')        // 3
tg.get('day')          // 13
tg.get('hour')         // 14
tg.get('minute')       // 30
tg.get('second')       // 45
tg.get('millisecond')  // 123
```

### Operaciones de Locale

```typescript
const tg = new TimeGuard('2024-03-13');

tg.locale()                      // "en"
tg.locale('es').locale()         // "es"

tg.locale('es').format('MMMM')   // "Marzo"
tg.locale('en').format('MMMM')   // "March"

// Registrar locale personalizado
const manager = LocaleManager.getInstance();
manager.setLocale('custom', { /* datos del locale */ });
```

### Operaciones de Zona Horaria

```typescript
const tg = new TimeGuard('2024-03-13', { timezone: 'UTC' });

tg.timezone()                     // "UTC"
tg.timezone('America/New_York')   // Nueva instancia con diferente zona horaria
```

## 🔧 Desarrollo

### Estructura del Proyecto

```
src/
├── index.ts                    # Punto de entrada principal
├── types.ts                    # Interfaces y tipos de TypeScript
├── time-guard.ts               # Clase principal TimeGuard
├── adapters/
│   └── temporal.adapter.ts      # Adaptador del API Temporal
├── formatters/
│   └── date.formatter.ts        # Estrategia de formateo de fechas
└── locales/
    └── locale.manager.ts        # Gestión de locales

test/
├── time-guard.test.ts          # Pruebas de funcionalidad principal
└── advanced.test.ts            # Pruebas de características avanzadas
```

### Comandos de Build

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Build watch
npm run build:watch

# Verificación de tipos
npm run type-check

# Lint
npm run lint

# Formatear
npm run format
```

## 🎨 Patrones de Diseño Utilizados

1. **Patrón Fachada** - `TimeGuard` proporciona interfaz unificada a múltiples subsistemas
2. **Patrón Adaptador** - `TemporalAdapter` convierte entre APIs
3. **Patrón Estrategia** - `DateFormatter` encapsula estrategias de formateo
4. **Patrón Singleton** - `LocaleManager` asegura una única instancia
5. **Patrón Factory** - Métodos estáticos para crear instancias
6. **Patrón Inmutable** - Todas las operaciones devuelven nuevas instancias

## 🌍 Locales Soportados

Actualmente soportados:
- `en` - Inglés
- `es` - Español (Español)

Agregar locales personalizados:

```typescript
import { LocaleManager } from '@bereasoftware/time-guard';

const manager = LocaleManager.getInstance();
manager.setLocale('fr', {
  name: 'fr',
  months: ['Janvier', 'Février', ...],
  monthsShort: ['Jan', 'Fév', ...],
  weekdays: ['Dimanche', 'Lundi', ...],
  weekdaysShort: ['Dim', 'Lun', ...],
  weekdaysMin: ['D', 'L', ...],
});
```

## 📝 Unidades Soportadas

Unidades disponibles para aritmética y formateo:

- `year` / `Y`
- `month` / `MMM` / `MMMM`
- `week` / `W`
- `day` / `D` / `DD`
- `hour` / `H` / `HH`
- `minute` / `m` / `mm`
- `second` / `s` / `ss`
- `millisecond` / `ms`

## 🧠 Detalles Clave de Implementación

### Inmutabilidad

Todas las operaciones devuelven nuevas instancias, asegurando inmutabilidad:

```typescript
const original = new TimeGuard('2024-03-13');
const modified = original.add({ day: 1 });

console.log(original.format('YYYY-MM-DD')); // "2024-03-13"
console.log(modified.format('YYYY-MM-DD')); // "2024-03-14"
```

### Seguridad de Tipos

Soporte completo de TypeScript con modo estricto:

```typescript
// Todo está tipado
const tg: TimeGuard = new TimeGuard('2024-03-13');
const formatted: string = tg.format('YYYY-MM-DD');
const diff: number = tg.diff(TimeGuard.now(), 'day');
```

### API Temporal

Usa el API nativo Temporal para operaciones precisas de fecha/hora:

```typescript
// Internamente usa Temporal.PlainDateTime
const temporal = tg.toTemporal();
```

## 🚀 Rendimiento

- Sobrecarga mínima a través del patrón adaptador
- Evaluación perezosa donde es posible
- Caché eficiente de locales
- Sin dependencias externas

## 📄 Licencia

Licencia MIT - Ver archivo LICENSE para detalles

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor asegúrate de:

1. Todas las pruebas pasan
2. Las nuevas características incluyen pruebas (TDD)
3. El código sigue principios SOLID
4. Cumple con modo estricto de TypeScript
5. La documentación se actualiza

## 📚 Referencias

- [Propuesta del API Temporal](https://tc39.es/proposal-temporal/)
- [Principios SOLID](https://en.wikipedia.org/wiki/SOLID)
- [Metodología BDD/TDD](https://en.wikipedia.org/wiki/Behavior-driven_development)

## 🎯 Roadmap

- [ ] Locales adicionales (FR, DE, IT, JP, etc.)
- [ ] Soporte avanzado de zona horaria
- [ ] Implementación de sistema de plugins
- [ ] Optimizaciones de rendimiento
- [ ] Polyfills de compatibilidad con navegador
- [ ] Patrones de recurrencia de fechas
- [ ] Operaciones de calendario

## 📧 Soporte

Para problemas, preguntas o sugerencias, por favor abre un issue en GitHub.

---

**Construido con ❤️ por Berea-Soft**
