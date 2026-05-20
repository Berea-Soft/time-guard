# DESIGN

Overview of the library architecture and design decisions.

## Design Philosophy

### 1. Temporal-First
TimeGuard is built from the ground up to be a wrapper around the **Temporal API** (via `@js-temporal/polyfill`). 
- **Immutability**: All operations return a new instance.
- **Precision**: Support for nanoseconds and precise durations.
- **Timezones**: First-class support for IANA timezones without external data files (using Intl).

### 2. Lightweight Core vs. Plugins
To keep the bundle size small for simple use cases, TimeGuard follows a "Pay for what you use" model:
- **Core**: Contains only essential arithmetic, parsing, and formatting.
- **Plugins**: Advanced features like `RelativeTime`, `Duration` objects, and `AdvancedFormat` are opt-in.
- **Bundles**: Multiple build targets (`lite`, `full`, `umd`) provide flexibility for different environments.

### 3. Developer Experience (DX)
The API is designed to be familiar to users of Moment.js or Day.js, easing the transition to modern Temporal-based logic.
- **Fluent API**: Chainable methods for manipulation.
- **Explainable Math**: The `explain()` method in durations provides transparency for debugging.

## Architectural Patterns

### Facade Pattern
The `TimeGuard` class acts as a facade, providing a unified interface to the underlying adapters, formatters, and managers.

### Adapter Pattern
The `TemporalAdapter` abstracts the interaction with the Temporal polyfill, ensuring that if the polyfill changes or if native support becomes available, only the adapter needs to be updated.

### Strategy Pattern
Parsing and formatting logic are implemented as strategies, allowing for different implementations (e.g., custom parsers) to be plugged in.

### Plugin Manager
A central `PluginManager` handles the lifecycle of plugins, ensuring they are correctly installed onto the `TimeGuard` prototype.

## High-level components
- **Core**: `src/index.ts` — Main class and entry point.
- **Adapters**: `src/adapters/temporal.adapter.ts` — Bridge to Temporal.
- **Locales**: `src/locales/` — Dictionary-based i18n system.
- **Plugins**: `src/plugins/` — Isolated feature extensions.
- **Formatters**: `src/formatters/date.formatter.ts` — Pattern-based string generation.

## Extensibility
- **Plugins**: Implement `ITimeGuardPlugin` and register with `PluginManager.use()`.
- **Locales**: Add new locale objects to `src/locales/` and register via `LocaleManager`.
- **Calendars**: Implement `ICalendarSystem` and register via `CalendarManager`.

See `ARCHITECTURE.md` for a more technical breakdown of the class hierarchy and internal data flow.
