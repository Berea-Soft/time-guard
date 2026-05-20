# AGENTS

High-level documentation of agents used for automation, CI, and local workflows.

## Project Context for Agents
TimeGuard is a modern, lightweight, and extensible date/time library for JavaScript/TypeScript, powered by the **Temporal API**.

### Architecture Overview
- **Core-First**: Lightweight core (`src/index.ts`) with basic date/time manipulation.
- **Adapter Pattern**: Uses `TemporalAdapter` to wrap the `@js-temporal/polyfill`.
- **Plugin System**: Extensible via `PluginManager`. Built-in plugins include `relative-time`, `duration`, and `advanced-format`.
- **I18n Native**: Multi-locale support via `LocaleManager`. Locales are defined in `src/locales/`.
- **Multi-Calendar**: Support for different calendar systems in `src/calendars/`.

### Tech Stack
- **Language**: TypeScript (Strict mode).
- **Bundler**: Vite (multiple modes: default, full, umd).
- **Testing**: Vitest.
- **Polyfills**: `@js-temporal/polyfill` (shipped in the `full` bundle).

## Guidelines for Agents
1. **Prefer Temporal**: When implementing new features, always look for a Temporal API equivalent first.
2. **Atomic Plugins**: New features should ideally be implemented as plugins unless they are essential core functionality.
3. **Locale-Aware**: Ensure all human-readable outputs are localized using `LocaleManager`.
4. **Test Driven**: Always add unit tests in `test/` for new features or bug fixes.
5. **Type Safety**: Maintain strict type definitions in `src/types/index.ts`.
6. **Documentation**: Update `README.md`, `ARCHITECTURE.md`, and this file as needed.

## Agent Roles
- **Default coding agent** — Interactive assistant for feature implementation and bug fixing.
- **Reviewer agent** — Focuses on code quality, performance, and adherence to design principles.
- **Release agent** — Handles versioning, changelog updates, and publishing.

## Commands Reference
- `npm test`: Run all tests.
- `npm run build`: Build the library in all modes.
- `npm run lint`: Check for linting issues.
- `npm run type-check`: Validate TypeScript types.
