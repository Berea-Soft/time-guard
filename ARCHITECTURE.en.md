# TimeGuard - Modern Date/Time Library

> 📚 **Documentation available in other languages:**
>
> 🇪🇸 [Español](ARCHITECTURE.md) | 🇬🇧 **English** (this file)

A modern, fully-typed TypeScript date/time library built using the **Temporal API**, following **SOLID principles**, and designed with **TDD/BDD** methodology.

## 🎯 Features

- ✨ **Fully TypeScript** - Complete type safety with strict mode
- 🕐 **Temporal API** - Uses JavaScript's new Temporal API for accurate date/time handling
- 🏗️ **SOLID Architecture** - Clean, maintainable, and extensible codebase
- 🧪 **TDD/BDD Tests** - Comprehensive test suite with Vitest
- 🌍 **i18n Support** - Built-in locale management (EN, ES, and extensible)
- 🔄 **Immutable** - All operations return new instances
- 🪝 **Plugin System** - Extend functionality with custom plugins
- 📦 **Zero Dependencies** - No external dependencies required

## 📦 Installation

```bash
npm install @bereasoftware/time-guard
```

## 🚀 Quick Start

```typescript
import { TimeGuard, timeGuard } from '@bereasoftware/time-guard';

// Create instance
const now = TimeGuard.now();
const date = new TimeGuard('2024-03-13');
const aliased = timeGuard('2024-03-13');

// Format
date.format('YYYY-MM-DD'); // "2024-03-13"
date.format('MMMM D, YYYY'); // "March 13, 2024"

// Arithmetic
date.add({ day: 5 }).format('YYYY-MM-DD'); // "2024-03-18"
date.subtract({ month: 1 }).format('YYYY-MM-DD'); // "2024-02-13"

// Query
date.isBefore(new TimeGuard('2024-03-20')); // true
date.isAfter(new TimeGuard('2024-03-10')); // true

// Manipulation
date.startOf('month').format('YYYY-MM-DD'); // "2024-03-01"
date.endOf('year').format('YYYY-MM-DD'); // "2024-12-31"

// Chaining
date
  .add({ month: 1 })
  .startOf('month')
  .format('YYYY-MM-DD'); // "2024-04-01"
```

## 🏛️ Architecture & SOLID Principles

### Single Responsibility Principle (SRP)

Each class has a single, well-defined responsibility:

```
├── TemporalAdapter      → Temporal API conversion
├── DateFormatter        → Date formatting logic
├── LocaleManager        → Locale management
└── TimeGuard            → Main facade & coordination
```

### Open/Closed Principle (OCP)

TimeGuard is open for extension through plugins:

```typescript
interface ITimeGuardPlugin {
  name: string;
  version: string;
  install(timeGuard: typeof TimeGuard, config?: unknown): void;
}
```

### Liskov Substitution Principle (LSP)

All date/time objects implement `ITimeGuard` interface consistently:

```typescript
interface ITimeGuard
  extends IDateArithmetic,
    IDateQuery,
    IDateManipulation {
  // ... required methods
}
```

### Interface Segregation Principle (ISP)

Small, focused interfaces instead of large ones:

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

### Dependency Inversion Principle (DIP)

Depends on abstractions, not concrete implementations:

```typescript
// Low-level modules depend on abstractions
class TimeGuard implements ITimeGuard {
  private localeManager: LocaleManager; // Singleton abstraction
  private formatter: DateFormatter;    // Dependency injection
  private temporal: Temporal.PlainDateTime | Temporal.ZonedDateTime;
}
```

## 🧪 Testing Strategy (TDD/BDD)

Tests are organized around user behaviors (BDD style):

```typescript
describe('TimeGuard - Core Functionality', () => {
  describe('Creating instances', () => {
    it('should create a TimeGuard instance with current date when no argument provided', () => {
      const tg = new TimeGuard();
      expect(tg.toDate()).toBeInstanceOf(Date);
    });
  });

  describe('Formatting', () => {
    it('should format with YYYY-MM-DD pattern', () => {
      const tg = new TimeGuard('2024-03-13T14:30:45.123');
      expect(tg.format('YYYY-MM-DD')).toBe('2024-03-13');
    });
  });

  // ... more tests
});
```

### Running Tests

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 📖 API Reference

### Creating Instances

```typescript
// Current date/time
TimeGuard.now()

// From various inputs
new TimeGuard('2024-03-13')
new TimeGuard(new Date())
new TimeGuard(1710340800000) // Unix timestamp (ms)
new TimeGuard({ year: 2024, month: 3, day: 13 })

// With configuration
new TimeGuard('2024-03-13', { locale: 'es', timezone: 'UTC' })

// Factory function
timeGuard('2024-03-13')
```

### Formatting

```typescript
const tg = new TimeGuard('2024-03-13T14:30:45');

// Custom patterns
tg.format('YYYY-MM-DD')           // "2024-03-13"
tg.format('DD/MM/YYYY')           // "13/03/2024"
tg.format('MMMM D, YYYY')         // "March 13, 2024"
tg.format('dddd')                 // "Wednesday"
tg.format('[Date: ]YYYY-MM-DD')   // "Date: 2024-03-13"

// Presets
tg.format('iso')       // ISO 8601
tg.format('date')      // Date only
tg.format('time')      // Time only
tg.format('datetime')  // Date and time
tg.format('rfc2822')   // RFC 2822
tg.format('utc')       // UTC format
```

### Arithmetic Operations

```typescript
const tg = new TimeGuard('2024-03-13');

tg.add({ day: 5 })
tg.add({ month: 1, day: 15 })
tg.add({ year: 1, hour: 5, minute: 30 })

tg.subtract({ day: 5 })
tg.subtract({ month: 1, year: 1 })

// Difference between dates
tg.diff(new TimeGuard('2024-03-20'), 'day')     // -7
tg.diff(new TimeGuard('2024-04-13'), 'month')   // -1
```

### Query Operations

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

### Manipulation Operations

```typescript
const tg = new TimeGuard('2024-03-13T14:30:45');

tg.clone()                         // New instance
tg.startOf('year')                 // 2024-01-01 00:00:00
tg.startOf('month')                // 2024-03-01 00:00:00
tg.startOf('day')                  // 2024-03-13 00:00:00

tg.endOf('year')                   // 2024-12-31 23:59:59
tg.endOf('month')                  // 2024-03-31 23:59:59

tg.set({ month: 12, day: 25 })     // 2024-12-25 14:30:45
tg.set({ hour: 0, minute: 0 })     // 2024-03-13 00:00:00
```

### Conversion Operations

```typescript
const tg = new TimeGuard('2024-03-13T14:30:45');

tg.toDate()           // JavaScript Date object
tg.toISOString()      // "2024-03-13T14:30:45Z"
tg.valueOf()          // Unix timestamp (ms)
tg.unix()             // Unix timestamp (seconds)
tg.toJSON()           // JSON-compatible string
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

### Locale Operations

```typescript
const tg = new TimeGuard('2024-03-13');

tg.locale()                      // "en"
tg.locale('es').locale()         // "es"

tg.locale('es').format('MMMM')   // "Marzo"
tg.locale('en').format('MMMM')   // "March"

// Register custom locale
const manager = LocaleManager.getInstance();
manager.setLocale('custom', { /* locale data */ });
```

### Timezone Operations

```typescript
const tg = new TimeGuard('2024-03-13', { timezone: 'UTC' });

tg.timezone()                     // "UTC"
tg.timezone('America/New_York')   // New instance with different timezone
```

## 🔧 Development

### Project Structure

```
src/
├── index.ts                    # Main entry point
├── types.ts                    # TypeScript interfaces & types
├── time-guard.ts               # Main TimeGuard class
├── adapters/
│   └── temporal.adapter.ts      # Temporal API adapter
├── formatters/
│   └── date.formatter.ts        # Date formatting strategy
└── locales/
    └── locale.manager.ts        # Locale management

test/
├── time-guard.test.ts          # Core functionality tests
└── advanced.test.ts            # Advanced features tests
```

### Build Commands

```bash
# Development
npm run dev

# Build
npm run build

# Build watch
npm run build:watch

# Type check
npm run type-check

# Lint
npm run lint

# Format
npm run format
```

## 🎨 Design Patterns Used

1. **Facade Pattern** - `TimeGuard` provides unified interface to multiple subsystems
2. **Adapter Pattern** - `TemporalAdapter` converts between APIs
3. **Strategy Pattern** - `DateFormatter` encapsulates formatting strategies
4. **Singleton Pattern** - `LocaleManager` ensures single instance
5. **Factory Pattern** - Static methods for creating instances
6. **Immutable Pattern** - All operations return new instances

## 🌍 Supported Locales

Currently supported:
- `en` - English
- `es` - Spanish (Español)

Add custom locales:

```typescript
import { LocaleManager } from '@bereasoftware/time-guard';

const manager = LocaleManager.getInstance();
manager.setLocale('de', {
  name: 'de',
  months: ['Januar', 'Februar', ...],
  monthsShort: ['Jan', 'Feb', ...],
  weekdays: ['Sonntag', 'Montag', ...],
  weekdaysShort: ['So', 'Mo', ...],
  weekdaysMin: ['S', 'M', ...],
});
```

## 📝 Units Supported

Available units for arithmetic and formatting:

- `year` / `Y`
- `month` / `MMM` / `MMMM`
- `week` / `W`
- `day` / `D` / `DD`
- `hour` / `H` / `HH`
- `minute` / `m` / `mm`
- `second` / `s` / `ss`
- `millisecond` / `ms`

## 🧠 Key Implementation Details

### Immutability

All operations return new instances, ensuring immutability:

```typescript
const original = new TimeGuard('2024-03-13');
const modified = original.add({ day: 1 });

console.log(original.format('YYYY-MM-DD')); // "2024-03-13"
console.log(modified.format('YYYY-MM-DD')); // "2024-03-14"
```

### Type Safety

Complete TypeScript support with strict mode:

```typescript
// Everything is typed
const tg: TimeGuard = new TimeGuard('2024-03-13');
const formatted: string = tg.format('YYYY-MM-DD');
const diff: number = tg.diff(TimeGuard.now(), 'day');
```

### Temporal API

Uses the native Temporal API for accurate date/time operations:

```typescript
// Internally uses Temporal.PlainDateTime
const temporal = tg.toTemporal();
```

## 🚀 Performance

- Minimal overhead through adapter pattern
- Lazy evaluation where possible
- Efficient locale caching
- No external dependencies

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please ensure:

1. All tests pass
2. New features include tests (TDD)
3. Code follows SOLID principles
4. TypeScript strict mode compliance
5. Documentation is updated

## 📚 References

- [Temporal API Proposal](https://tc39.es/proposal-temporal/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [BDD/TDD Methodology](https://en.wikipedia.org/wiki/Behavior-driven_development)

## 🎯 Roadmap

- [ ] Additional locales (FR, DE, IT, JP, etc.)
- [ ] Advanced timezone support
- [ ] Plugin system implementation
- [ ] Performance optimizations
- [ ] Browser compatibility polyfills
- [ ] Date recurrence patterns
- [ ] Calendar operations

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Built with ❤️ by Berea-Soft**
