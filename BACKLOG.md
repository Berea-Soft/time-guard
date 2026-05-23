# TimeGuard Backlog

## Milestone sugerido: v3.0.0 (The Modern Era)

### P0 (Fundación y Estabilidad)

- [x] `feat(core): Temporal API integration`
  Objetivo: Migrar la lógica interna a la API de Temporal para máxima precisión.
  Criterio de aceptación: Todos los cálculos de fecha usan internamente @js-temporal/polyfill.

- [x] `feat(plugins): plugin manager and lifecycle`
  Objetivo: Permitir la extensión de la librería sin inflar el core.
  Criterio de aceptación: Plugins como `duration` y `relative-time` se cargan dinámicamente.

- [x] `fix(build): stabilize full and umd outputs`
  Objetivo: Asegurar que los bundles generados por Vite sean consistentes y libres de errores de exportación.
  Criterio de aceptación: Las pruebas de verificación de exportaciones pasan en todos los entornos (Node, Browser).
  **Completado:** Agregado entry `time-guard`, configurado `fileName`, agregado plugin `dts`, test de bundle actualizado.

- [x] `test(coverage): increase coverage for plugins and edge cases`
  Objetivo: Garantizar la robustez de las extensiones.
  Criterio de aceptación: Cobertura > 80% en plugins y lógica de años bisiestos.
  **Actual:** Statements 87.24%, Branches >80%, Functions 91.69%, Lines 87.62%.
  **Progreso:** 580+ tests pasando, +55 tests añadidos para cubrir branches edge cases.

### P1 (Funcionalidades Clave y DX)

- [x] `feat(i18n): multi-locale support system`
  Objetivo: Soportar internacionalización de forma nativa.
  Criterio de aceptación: `LocaleManager` carga y cambia locales en caliente.

- [x] `docs(api): document plugin and calendar system`
  Objetivo: Facilitar la creación de extensiones por parte de la comunidad.
  Criterio de aceptación: Guía detallada en `PLUGINS.md` y ejemplos en `DESIGN.md`.
  **Completado:** DESIGN.md expandido con documentación completa de ITimeGuardPlugin, ICalendarSystem, ILocale, ejemplos de creación de plugins personalizados, calendarios y locales.

- [x] `feat(locales): expand locale database`
  Objetivo: Cubrir regiones de África y Sudamérica.
  Criterio de aceptación: Al menos 10 nuevos locales añadidos y verificados.

- [x] `ci: use frozen lockfile and node matrix`
  Objetivo: Instalaciones reproducibles y compatibilidad multi-versión.
  Criterio de aceptación: GitHub Actions corre en Node 20, 22 y 23.

### P2 (Ecosistema y Avanzado)

- [x] `feat(logic): advanced TimeRange (overlaps, intersect, union)`
  Objetivo: Lógica de conjuntos para rangos de tiempo.
  Criterio de aceptación: API fluida para comparar periodos de tiempo.

- [x] `feat(logic): business days and holiday calendars`
  Objetivo: Lógica específica para aplicaciones empresariales.
  Criterio de aceptación: Soporte para `addBusinessDays` y carga de calendarios de festivos.

- [x] `feat(perf): native mode (zero-polyfill build)`
  Objetivo: Reducir bundle size para entornos modernos.
  Criterio de aceptación: Build que asume `globalThis.Temporal` sin incluir polyfill.

- [x] `feat(frameworks): React/Vue/Angular wrappers`
  Objetivo: Integración idiomática en frameworks populares.
  Criterio de aceptación: Hooks/Directivas funcionales para manejo de fechas.

## Recomendación de ejecución

1. ~~Estabilizar los outputs de build (P0).~~ ✅ Completado
2. ~~Completar la documentación técnica (P1).~~ ✅ Completado
3. ~~Implementar lógica de TimeRange avanzado (P2).~~ ✅ Completado

## Quick Wins

- [x] `feat(core): humanize and explain functionality`
- [x] `ci: use frozen lockfile in GitHub Actions`
- [x] `docs(api): comprehensive plugin documentation`
- [x] `feat(locales): add priority regional locales`

## Cambios Estructurales

- [x] `refactor(core): adapter pattern for Temporal API`
- [x] `design(api): fluent chainable interface`
- [x] `feat(perf): native mode build target`
- [x] `feat(logic): advanced TimeRange mathematical operations`

## Siguiente Release Recomendada

### v2.6.0

- [x] `fix(build): stabilize full and umd outputs`
- [x] `ci: use frozen lockfile and node matrix`
- [x] `docs(api): document plugin and calendar system`

### v3.0.0+

- [x] `feat(logic): advanced TimeRange and Business Days`
- [x] `feat(perf): native mode (zero-polyfill build)`
- [x] `feat(frameworks): official wrappers`

## 📊 Métricas Actuales

| Métrica | Valor | Meta |
|---------|-------|------|
| Lint errors | 0 | 0 ✅ |
| Lint warnings (any) | 0 | 0 ✅ |
| Tests | 580+ | - |
| Statements coverage | 87.24% | >80% ✅ |
| Branches coverage | >80% | >80% ✅ |
| Functions coverage | 91.69% | >80% ✅ |
| Lines coverage | 87.62% | >80% ✅ |
