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

## Auditoría 2026-07-04 (Seguridad, Código y Performance)

> Generado a partir de una revisión completa del repo (git config, `.gitignore`, dependencias, `src/`, `docs-app/`, CI/CD). Nada crítico/bloqueante encontrado en seguridad; los hallazgos de mayor impacto están en código (bug de precisión, tests "theater") y performance (bundle sin minificar, carga eager de locales).

### P0 (Bugs y deuda de mayor impacto)

- [x] `fix(core): clone() trunca precisión sub-milisegundo`
  Objetivo: `clone()` (`src/core.ts:1135-1137`) hace round-trip por `toDate()` (resolución de milisegundos), perdiendo microsegundos/nanosegundos. Como `locale()` y `timezone()` llaman internamente a `clone()`, cualquier instancia con precisión de nanosegundos la pierde silenciosamente al invocar esos métodos.
  Criterio de aceptación: `clone()` preserva precisión completa (test con nanosegundos que verifique igualdad exacta tras `.locale()`/`.timezone()`).
  **Completado:** `clone()` ahora reutiliza `TimeGuard.fromTemporal(this.temporal, this.config)` en vez de pasar por `toDate()`, preservando el objeto Temporal inmutable original. Agregados 3 tests en `test/time-guard.test.ts` ("Sub-millisecond precision") que verifican micro/nanosegundos tras `clone()`, `.locale()` y `.timezone()`.

- [x] `test(coverage): eliminar tests "theater" en coverage.test.ts`
  Objetivo: `test/coverage.test.ts` tiene ~180 asserts `toBeDefined()` (p.ej. líneas 1577-1608) que no verifican valores reales de lógica de calendarios/años bisiestos — no pueden fallar aunque el cálculo esté mal. Esto infla la cobertura reportada (87%) sin validar corrección real.
  Criterio de aceptación: Reemplazar asserts triviales por comparaciones de valores esperados en la lógica de calendarios cubierta por ese archivo.
  **Completado (parcial):** Reemplazados los 8 asserts `toBeDefined()` sobre lógica de calendarios (Islamic/Hebrew/Chinese/Japanese/Buddhist `getMonthName`/`isLeapYear`/`daysInMonth`, líneas ~1575-1608) por valores esperados concretos derivados de la implementación real. Quedan otros `toBeDefined()` en el archivo (formatos/plugins) sin auditar — evaluar caso por caso si son legítimos (salida no determinística) o requieren el mismo tratamiento.

### P1 (Consistencia y mantenibilidad)

- [x] `refactor(managers): unificar semántica de error entre PluginManager/CalendarManager/LocaleManager`
  Objetivo: Hoy `PluginManager.register` lanza en fallo pero solo hace `console.warn` en duplicados; `CalendarManager.setDefault` no-opea silenciosamente con id desconocido; `LocaleManager.getLocale` cae a inglés sin avisar. Comportamientos distintos para operaciones conceptualmente iguales.
  Criterio de aceptación: Los tres managers documentan y aplican la misma política (throw vs warn vs fallback) para register/lookup inválidos.
  **Completado:** Política unificada: los fallos de instalación siguen lanzando (`PluginManager`, único caso de error irrecuperable), y todo lo demás pasa de fallo silencioso a `console.warn` + fallback: `CalendarManager.register` avisa al sobrescribir un id ya registrado, `CalendarManager.setDefault` avisa y no-opea si el id no existe, `LocaleManager.getLocale` avisa antes de caer a `en`. Ningún comportamiento observable (valores de retorno) cambió, solo se agregó visibilidad.

- [x] `refactor(frameworks): extraer lógica compartida de wrappers (react/vue/svelte/solid/qwik)`
  Objetivo: `src/react.ts`, `src/vue.ts`, `src/svelte.ts`, `src/solid.ts`, `src/qwik.ts` reimplementan `useTimeGuard`/`useCurrentTime`/`useRelativeTime`/`useTimeRange` casi idénticos (mismos intervalos por defecto, misma lógica de `since().humanize()`). Un fix o cambio de default requiere tocar 5+ archivos.
  Criterio de aceptación: Lógica común extraída a un núcleo compartido (framework-agnóstico); cada wrapper solo adapta al sistema de reactividad correspondiente.
  **Completado:** Agregados `DEFAULT_TICK_INTERVAL_MS`, `DEFAULT_RELATIVE_INTERVAL_MS`, `computeRelativeTime()` y `createTimeRangeFrom()` en `src/core.ts` (único módulo que los 5 wrappers ya importaban, evitando crear un nuevo chunk compartido en el build — verificado con `dist/` limpio: solo aparecen los chunks `core-*`/`locales-*` ya permitidos por `bundle-size.test.ts`). Los 5 wrappers ahora reusan esos helpers en vez de reimplementar `since().humanize()` y los magic numbers 1000/60000. Cada wrapper conserva su glue de reactividad específica (useState/ref/signal/store).

- [x] `chore(deps): eliminar dependencia no usada vue-icons-plus`
  Objetivo: `package.json` declara `vue-icons-plus` como `dependency` de la librería raíz pero no se usa en `src/` — se instala en cada consumidor de una librería que se promociona como "zero-dependencies".
  Criterio de aceptación: Dependencia eliminada de `package.json`/lockfile sin romper build ni tests.
  **Completado:** Eliminada de `package.json` y `pnpm-lock.yaml` (confirmado sin referencias en `src/`). Typecheck/lint/tests siguen pasando.

- [x] `refactor(types): reducir uso de \`as unknown as X\` en core.ts y plugins`
  Objetivo: 25+ casts vía `unknown` (`src/core.ts:809,872,929,960`, `src/adapters/temporal.adapter.ts:266`, plugins `relative-time`/`duration`/`advanced-format`) evaden el chequeo estructural igual que `any`, aunque el lint de "no-explicit-any" pase.
  Criterio de aceptación: Reducir casts inseguros mediante tipos/guards adecuados donde sea viable; documentar los que sean inevitables.
  **Completado:** Eliminados los 5 casts en `core.ts`/`temporal.adapter.ts` que eran innecesarios — `Temporal.PlainDateTime`/`Temporal.Duration` (tipos reales del polyfill) ya exponen `year`/`month`/.../`nanosecond` y `years`/.../`nanoseconds` como propiedades directas, así que bastaba tipar los mapas de lookup (`GetNumericField`, `DurationPluralField`) con la unión literal correcta en vez de pasar por `Record<string, unknown>`. `get()`, `add()` y ambas ramas de `diff()` ya no usan `as unknown as`. Los ~19 casts restantes (en `plugins/relative-time`, `plugins/duration`, `plugins/advanced-format`) son necesarios: extienden `TimeGuardClass.prototype` con métodos que no existen en el tipo estático de la clase (patrón de mixin/monkey-patch de plugins), y no hay forma de tipar eso sin pasar por `unknown` salvo migrar a "declaration merging" por plugin — un cambio arquitectónico mucho más invasivo que contradice el modelo de instalación de plugins como side-effect ya documentado en PLUGINS.md. Se dejan intencionalmente sin tocar.

- [x] `docs(calendars): advertir sobre precisión de calendarios experimentales`
  Objetivo: `ChineseCalendar.isLeapYear` (`src/calendars/index.ts:174-177`) usa `year % 3 === 0`, que no refleja el ciclo lunisolar real. La clase está marcada `@experimental` en código pero DESIGN.md la lista junto a Gregoriano sin aclarar la limitación.
  Criterio de aceptación: DESIGN.md/README indican explícitamente qué calendarios son aproximados/experimentales.
  **Completado:** Tabla de "Built-in Calendars" en DESIGN.md ahora incluye columna "Accuracy" marcando Islamic/Hebrew/Chinese como `⚠️ Experimental` con nota explicando que no deben usarse para fechas religiosas/civiles autoritativas.

- [x] `chore(lint): limpiar patrones obsoletos en eslint.config.js`
  Objetivo: `eslint.config.js:10` referencia `src/realtime/**`, `src/http-client/node-http-adapter.ts`, `src/testing/**/*`, rutas que no existen en el repo (config copiada de otro proyecto).
  Criterio de aceptación: Config de ESLint solo referencia rutas reales del proyecto.
  **Completado:** `files` simplificado a `['src/**/*.ts', 'test/**/*.ts', '*.js']`. Lint sigue pasando con 0 warnings.

- [x] `chore(docs-app): actualizar versión pineada de time-guard`
  Objetivo: `docs-app/package.json` fija `@bereasoftware/time-guard` en `^2.6.1` mientras el root está en `2.7.2` — el sitio de docs/demo no necesariamente refleja los fixes actuales.
  Criterio de aceptación: docs-app consume la misma versión (o workspace link) que el paquete raíz.
  **Completado:** Bumped a `^2.7.2` (versión publicada según CHANGELOG.md) y regenerado `docs-app/pnpm-lock.yaml`. `typecheck:docs` pasa.

- [x] `ci(security): pasar VERCEL_TOKEN por variable de entorno en vez de argumento CLI`
  Objetivo: `.github/workflows/deploy-web.yml:77,114` pasa `VERCEL_TOKEN` como `--token` literal, visible en argv de procesos concurrentes en el runner.
  Criterio de aceptación: Token pasado vía env var nativa del CLI de Vercel.
  **Completado:** Ambos jobs (`deploy-preview`, `deploy-production`) pasan el token vía `env: VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}`; se eliminó el flag `--token` de la línea de comandos.

### P2 (Performance)

- [x] `perf(build): habilitar minificación en todos los formatos de bundle`
  Objetivo: `vite.config.ts:98` tiene `minify: false` para ES/CJS/UMD/IIFE. Verificado en disco: `time-guard.es.js` ~221KB, `time-guard.umd.js` ~354KB sin minificar. Reducción esperada 50-70%.
  Criterio de aceptación: Bundles publicados minificados sin romper sourcemaps ni tests de exportación.
  **Completado:** `minify: false` → `minify: true`. `time-guard.es.js` pasó de 221KB a 212KB en crudo (gzip 54.01KB → 52.51KB). El banner de licencia (`/*! time-guard v... */`) se preserva porque Rollup/Rolldown lo inyecta en la fase de output, después de la minificación. **Bonus:** corregí un bug real en `test/bundle-size.test.ts` — el regex que permite los chunks compartidos `core-*`/`locales-*` (`[A-Za-z0-9]+`) no cubría `_`/`-`, que sí aparecen en los hashes que genera Rolldown; por eso el test "no shared chunks" venía fallando de forma intermitente durante toda la sesión (documentado como "fallo preexistente" en ítems anteriores). Ampliado a `[A-Za-z0-9_-]+`; la suite completa corre ahora 630/630 en verde, sin fallos conocidos.

- [x] `perf(core): evitar carga eager de todos los locales + polyfill en el entry principal` **(BREAKING CHANGE — requiere v3.0.0)**
  Objetivo: `src/index.ts:12-26` registra `Temporal` en `globalThis` y carga los 11 locales (`ALL_LOCALES`) al importar el paquete, pese a `"sideEffects": false` en `package.json`. El export `./locales` para carga perezosa queda inútil porque el entry principal ya carga todo.
  Criterio de aceptación: Import por defecto no fuerza carga de locales no usados; carga perezosa real vía `./locales` o registro explícito por el consumidor.
  **Completado — decisión explícita del usuario de romper compatibilidad ahora (no en versión menor):** `src/index.ts` ya no llama `LocaleManager.getInstance().loadLocales(ALL_LOCALES)` al importar; el polyfill de Temporal sigue auto-cargándose igual que antes (eso no estaba en el alcance del hallazgo). Por defecto solo quedan registrados `en`/`es` (comportamiento ya existente de `LocaleManager`, sin cambios). Agregada función `loadAllLocales()` (exportada desde el entry principal) como forma explícita de restaurar el comportamiento anterior con una sola llamada. Verificado en runtime con un script aislado: antes de `loadAllLocales()` solo `['en','es']`; después, 47 locales.
  **Nota importante:** README.md/README.en.md ya documentaban esta arquitectura ("Core ~5KB gzip, solo EN/ES, locales bajo demanda") — la carga eager en `index.ts` contradecía la propia documentación del proyecto; este fix alinea el código con lo ya prometido. Actualizados `LOCALES.md`/`LOCALES.en.md` (nota de breaking change v3 + snippet de migración), `README.md`/`README.en.md` (ejemplos de locale ahora incluyen `loadAllLocales()`), y agregada sección "Breaking changes → v3.0.0" en `MIGRATION.md` con la ruta de migración completa. Agregados 2 tests en `test/locales.test.ts` que verifican el estado por defecto (`en`/`es`) y que `loadAllLocales()` registra los 47 locales. 632/632 tests, lint y typecheck en verde.
  **Pendiente para quien haga el release:** el bump de versión a 3.0.0 lo debe generar `semantic-release` a partir del mensaje de commit (footer `BREAKING CHANGE:` o `!` en el tipo) — no edité `package.json` a mano porque el versionado es automático en este repo (ver `.releaserc`).

- [x] `perf(docs-app): code-splitting de rutas y del CodeEditor/Sandpack`
  Objetivo: `docs-app/src/router/index.ts` importa todas las páginas de forma estática (sin rutas lazy) y `CodeEditor.vue`/`playground/index.ts` importan CodeMirror y `@codesandbox/sandpack-client` de forma estática. Resultado: un chunk único de ~900KB que pagan incluso los usuarios que solo ven la landing. El aumento de `chunkSizeWarningLimit` a 1000 en `docs-app/vite.config.ts` tapa el síntoma en vez de resolverlo.
  Criterio de aceptación: Rutas y editor/sandbox cargados vía `import()` dinámico; chunk principal reducido significativamente sin subir el warning limit.
  **Completado:** Todas las rutas en `router/index.ts` (`LandingPage`, `DocsLayout`/`HomePage`/`DocPage`, `DemosLayout`/`DemosList`/`DemoPage`) ahora usan `component: () => import(...)`. Como `CodeEditor.vue` (CodeMirror) y el playground de Sandpack solo son alcanzables desde `DocPage`/`DemoPage`, quedaron automáticamente fuera del chunk principal sin tocarlos directamente. Revertido `chunkSizeWarningLimit` a su default (500KB). Resultado real: chunk principal `index-*.js` pasó de ~900KB a **103.86KB** (gzip 39.06KB); CodeMirror quedó en su propio chunk async `CodeEditor-*.js` (561.93KB, gzip 192.99KB) que solo se descarga al abrir un demo/doc con editor — Vite ahora emite (correctamente) el warning de >500KB solo para ese chunk lazy, que no bloquea el primer render. `vue-tsc --noEmit`, `lint:docs` y el build completo pasan.

- [x] `perf(core): evitar reformateo de fecha en cada iteración de isHoliday/addBusinessDays`
  Objetivo: `isHoliday()` (`src/core.ts:1648-1650`) formatea la fecha completa (regex + tokens) solo para construir una clave de lookup; `addBusinessDays` la llama una vez por día avanzado, por lo que `addBusinessDays(2500)` hace 2500 pasadas de formateo.
  Criterio de aceptación: Clave de lookup construida a partir de campos year/month/day sin pasar por el formateador completo.
  **Completado:** `isHoliday()` construye la clave `YYYY-MM-DD` directamente desde `get('year')`/`get('month')`/`get('day')` con `padStart`, sin pasar por `DateFormatter`. `registerHolidays()` sigue usando `format('YYYY-MM-DD')` para poblar el Set, así que las claves siguen siendo idénticas — 10 tests de holidays/business-days verificados en verde.

- [x] `perf(core): cachear validación/orden en operaciones de TimeRange`
  Objetivo: `overlaps`/`intersect`/`union`/`contains` (`src/core.ts:491-567`) recalculan `getOrdered()` y `validatePlainDateTime` en cada llamada pese a que `_start`/`_end` son inmutables tras el constructor. Costoso en comparaciones pairwise sobre N rangos.
  Criterio de aceptación: Orden/validación calculados una vez y reutilizados mientras el rango no cambie.
  **Completado:** `getOrdered()` cachea el resultado en `_ordered` la primera vez que se llama (lazy) y lo reutiliza en llamadas posteriores — válido porque `_start`/`_end` no tienen setters. 37 tests de TimeRange en verde.

- [x] `perf(core): acotar el cache estático de holidays`
  Objetivo: `private static holidays: Set<string>` (`src/core.ts:578`) es compartido por todas las instancias, solo crece vía `registerHolidays()`, sin cap ni TTL — riesgo de memory leak en procesos long-running (ej. multi-tenant).
  Criterio de aceptación: Mecanismo de límite/eviction o alcance no-estático documentado para el caso multi-tenant.
  **Completado (documentación, sin cap arbitrario):** Agregado JSDoc en `registerHolidays()` explicando que el registro es aditivo, sin límite, y pensado para poblarse una sola vez al iniciar la app — no por request/tenant en un servidor long-running (usar `clearHolidays()` entre tenants si se necesita). No impuse un cap numérico porque es una decisión de producto (¿cuántos holidays son "demasiados"? un consumidor cargando 20 años x muchos países es un uso legítimo, no una fuga) — capar arbitrariamente rompería ese caso sin resolver el uso indebido real (llamar `registerHolidays` por-request).

- [x] `perf(frameworks): evitar JSON.stringify(config) por render/tick`
  Objetivo: `src/react.ts:56,80` y `src/vue.ts:120-121,192-193` serializan el config completo en cada render/watch (Vue además con `{ deep: true }`) solo para detectar cambios.
  Criterio de aceptación: Detección de cambios sin serializar el objeto completo en cada ciclo (ej. comparar campos relevantes o memoizar).
  **Completado:** `ITimeGuardConfig` solo tiene 3 campos primitivos (`locale`, `timezone`, `strict`), así que en vez de `JSON.stringify(activeConfig)` como dependencia de `useEffect`/`watch`, ahora se listan esos 3 campos directamente (`activeConfig?.locale`, etc.) — comparación por igualdad primitiva, sin allocar un string en cada render/tick. Aplicado en `useTimeGuard`/`useCurrentTime`/`useTimeRange` de `react.ts` y `useTimeGuard` de `vue.ts` (también se quitó el `{ deep: true }` en Vue, innecesario para getters de primitivos). 18 tests de frameworks en verde.

## Hallazgo 2026-07-06 (test suite corría contra un mock, no contra Temporal real)

> Descubierto al construir `PluginsDemo.vue` en docs-app: `fromNow()`/`toNow()` mostraban "0 years ago" en vez del tiempo real. La investigación reveló que **todo el test suite corría contra un mock de Temporal hecho a mano**, no contra `@js-temporal/polyfill` — un bug de infraestructura de tests que estuvo enmascarando bugs reales de la librería (los mismos que corren en producción, porque `src/index.ts` sí instala el polyfill real).

- [x] `fix(tests): setup.ts nunca instalaba el polyfill real de Temporal`
  Objetivo: `test/setup.ts` hacía `import('./temporal-mock')` sin `await` y luego `await import('@js-temporal/polyfill')` — pero ese paquete solo expone named exports (`Temporal`, `Intl`), no tiene efecto secundario sobre `globalThis`. El mock (con su propio guard `if (!globalThis.Temporal)`) ganaba la carrera casi siempre, dejando el mock activo para *todo* el suite, silenciosamente, probablemente desde que el archivo existe.
  Criterio de aceptación: `globalThis.Temporal` queda determinísticamente en el polyfill real durante los tests; el mock solo se usa si esa importación falla.
  **Completado:** `setup.ts` ahora hace `const { Temporal } = await import('@js-temporal/polyfill')` y asigna a `globalThis.Temporal` sin guard (unconditional), con el mock como fallback real en el `catch`.

- [x] `fix(core): diff()/until()/since() sin largestUnit explícito colapsaban a días`
  Objetivo: Con Temporal real activo, `jan.until(mar)` devolvía `months: 0` (el default `largestUnit: 'auto'` de Temporal tapa el balanceo en `'day'`) en vez de `months: 2`. El mock nunca respetó `largestUnit`/`smallestUnit`, por lo que este bug era invisible en tests.
  Criterio de aceptación: `until()`/`since()` devuelven breakdown calendario (años/meses/días) por defecto, salvo que el caller pida otra unidad.
  **Completado:** `until()`/`since()` en `src/core.ts` ahora default a `largestUnit: options?.largestUnit || 'year'`.

- [x] `fix(core): diff(other, {mode:'calendar'}) dependía del orden this/other`
  Objetivo: `start.diff(end, {mode:'calendar'})` con `start` anterior a `end` devolvía meses/días negativos, inconsistente con `between()` (que siempre normaliza a positivo).
  Criterio de aceptación: El breakdown en modo calendario es siempre no-negativo, sin importar cuál fecha sea "this".
  **Completado:** El branch `mode === 'calendar'` en `diff()` ahora detecta cuál fecha es anterior/posterior antes de llamar `.since()`, igualando el contrato de `between()`.

- [x] `fix(adapters): TemporalAdapter no podía parsear su propio toJSON()/toISOString()`
  Objetivo: `new TimeGuard(original.toJSON())` caía silenciosamente a "ahora" en vez de reconstruir la fecha original — `Temporal.PlainDateTime.from()` real *rechaza* strings con designador `Z` ("Z designator not supported for PlainDateTime"), a diferencia del mock que lo ignoraba vía regex.
  Criterio de aceptación: Cualquier ISO string con `Z` u offset numérico producido por la propia librería se puede volver a parsear.
  **Completado:** `parseISOString()` ahora limpia un `Z` u offset (`+HH:MM`/`-HH:MM`) final antes de llamar a `Temporal.PlainDateTime.from()`, igual que ya hacía `fromDate()`.

- [x] `fix(adapters): toISOString() omitía milisegundos cuando eran 0`
  Objetivo: Temporal's `.toString()` omite la fracción de segundos si es cero, a diferencia de `Date#toISOString()` que siempre muestra `.000`. Rompía cualquier test/consumidor que comparara contra el formato estilo `Date`.
  Criterio de aceptación: `toISOString()` siempre incluye milisegundos.
  **Completado:** `TemporalAdapter.toISOString()` pasa `{ smallestUnit: 'millisecond' }` a `.toString()`.

- [x] `fix(adapters): parseToPlainDateTime fallaba con inputs Temporal.PlainTime`
  Objetivo: `now.with(plainTime)` — esta versión del polyfill (`0.5.1`) rechaza pasar un `PlainTime` a `.with()` ("use withPlainTime() instead"); es un cambio de API entre versiones del polyfill, no un uso incorrecto.
  Criterio de aceptación: Pasar un `Temporal.PlainTime` como input a `TimeGuard` funciona.
  **Completado:** Cambiado a `now.withPlainTime(input)`.

**Impacto:** con el fix de `setup.ts` aplicado (Temporal real activo), 25 tests que antes pasaban (contra el mock) empezaron a fallar — no por regresión, sino porque exponían comportamiento real de la librería nunca antes ejercitado en CI. Los 6 fixes de arriba corrigen ese comportamiento; 2 tests con aserciones basadas en supuestos del mock (signo/redondeo de `diff(..., 'day')`) se corrigieron para reflejar el resultado correcto. Suite completo: 638/638 tests, lint y typecheck limpios.

- [x] `fix(core): DurationResult.humanize() colapsaba a "0 seconds" con duraciones negativas`
  Objetivo: Descubierto al construir `LocalesDemo.vue` — `past.since(now).humanize()` (con `past` anterior a `now`, resultado con signo negativo) devolvía siempre `"0 seconds"` porque `humanize()` filtraba `parts.filter(p => p.value > 0)`, que descarta cualquier parte negativa. Bug latente no cubierto por ningún test existente porque `until()`/`between()` siempre normalizan a orden positivo antes de humanizar.
  Criterio de aceptación: `humanize()` funciona igual de bien con duraciones con signo (`since()` en cualquier orden) que con las ya-normalizadas de `until()`/`between()`.
  **Completado:** El filtro pasa a `p.value !== 0`; la rama de mayor-unidad-única sigue pasando el valor con signo a `Intl.RelativeTimeFormat` (que ya sabe expresar pasado/futuro), y las ramas de fallback/`fullBreakdown` usan `Math.abs()` para la magnitud mostrada.

## Hallazgo 2026-07-07 (docs-app: demos sin StackBlitz, `/docs` con huecos de cobertura)

> A pedido de revisar que todos los demos usen StackBlitz y que `/docs` cubra todo lo que hace TimeGuard.

- [x] `feat(docs-app): embed StackBlitz para los 7 demos nativos (Vue/Locales/Calendarios/Plugins/TimeRange/BusinessDay/API)`
  Objetivo: Solo los 5 demos no-Vue (React/Angular/Svelte/Solid/Qwik) corrían dentro de un embed StackBlitz vía `FrameworkSandbox`; los 7 demos nativos en Vue solo tenían su preview instantáneo en docs-app, sin sandbox — inconsistente con el resto de la galería. Primer intento (un botón "Abrir en StackBlitz" externo agregado a `CodeRunTabs.vue`) funcionaba pero no era lo pedido: el usuario confirmó que quería el mismo embed inline (editor+preview) que los otros 5, no solo un link.
  Criterio de aceptación: Los 12 demos usan exactamente el mismo componente `FrameworkSandbox` (mismo header, mismo embed StackBlitz, mismo botón), sin importar el framework.
  **Completado:** Cada uno de los 7 demos nativos se dividió en `examples/<Nombre>Demo.vue` (wrapper: exporta `title`/`slug`/`code` y renderiza `<FrameworkSandbox framework="vue">`) + `examples/_sources/<Nombre>DemoSource.vue` (el código real, sin cambios de comportamiento, leído vía el loader `?raw` de Vite — evita reescribir/escapar el código como string JS, que ya causó bugs de escaping esta sesión). Revertido el botón ad-hoc de `CodeRunTabs.vue`/`DemoPage.vue` (`sandboxed` prop) al quedar innecesario — los 12 demos ahora exportan `code` uniformemente.

- [x] `fix(docs-app): sandbox Vue con Tailwind ilegible — texto claro sobre tarjetas claras`
  Objetivo: Al verificar el embed visualmente, el texto de las tarjetas era ilegible (gris claro sobre fondo blanco). Causa raíz doble: (1) probé Tailwind v4 vía `@tailwindcss/vite`, cuyo motor oxide se cuelga indefinidamente dentro de WebContainers (confirmado en vivo: `npm run dev` nunca imprimió "ready" tras 70s+); (2) al cambiar a Tailwind v3 vía PostCSS clásico, `tailwind.config.js`/`postcss.config.js` usaban `module.exports` en un proyecto con `"type":"module"` (`ReferenceError: module is not defined`); (3) ya con PostCSS funcionando, el `<body>` del sandbox forzaba `text-slate-100` (modo oscuro) mientras las tarjetas reales son `bg-white dark:bg-slate-800/50` con `dark:` **class-based** (igual que `docs-app/src/assets/main.css`) — sin una clase `.dark` presente, las tarjetas quedan en su versión clara pero el texto forzado seguía siendo claro.
  Criterio de aceptación: El sandbox Vue instala y compila Tailwind exitosamente, y el texto es legible sin depender de que se togglee modo oscuro.
  **Completado:** `buildVueApp()` (`docs-app/src/playground/templates/vue.ts`) usa Tailwind v3 (`tailwindcss`/`postcss`/`autoprefixer`, sin motor nativo/WASM) con `tailwind.config.js`/`postcss.config.js` en sintaxis ESM, y el `<body>` del sandbox usa `bg-slate-50 text-slate-900` (modo claro, igual que el default real de docs-app) con `darkMode: 'class'` en vez de `'media'`. Verificado en vivo: `VITE ready in ~2.6-3.4s`, tarjetas con contraste correcto en Calendarios/Plugins/BusinessDay/Vue.

- [x] `fix(docs-app): sandboxes StackBlitz instalan @bereasoftware/time-guard@latest de npm, no el código local`
  Objetivo: Descubierto al verificar `LocalesDemo`: su sandbox fallaba por completo (`SyntaxError: ... does not provide an export named 'loadAllLocales'`, preview en blanco) porque `TIME_GUARD_VERSION = 'latest'` instala la ÚLTIMA VERSIÓN PUBLICADA en npm, que no incluía `loadAllLocales`/`getAvailableLocales` ni los fixes de `diff()`/`humanize()`/etc. de esta sesión. `PluginsDemo` no crasheaba pero mostraba valores viejos ("0 years ago") por el mismo motivo.
  Criterio de aceptación: publicar una nueva versión a npm con todo lo acumulado — no hay fix de código que lo evite mientras el sandbox dependa del registro público.
  **Completado:** Usuario publicó la versión 2.8.0 a npm (commits agrupados por tema + push a `main`, semantic-release corrió en CI). Verificado en vivo post-publish: `LocalesDemo` renderiza los 47 locales correctamente, `PluginsDemo` muestra `fromNow(): 5 hours ago` / `toNow(): in 2 days` / `explain()` con Years:2 Months:1 Days:4 — todos los valores correctos, ya no obsoletos.

- [x] `docs(docs-app): completar huecos de cobertura en /docs`
  Objetivo: `AdvancedFormatPlugin` (tokens Q/Do/w/k/X/x) no tenía página; el sistema de plugins solo mostraba cómo *consumir* plugins built-in, no cómo escribir uno propio (`ITimeGuardPlugin`); los calendarios alternativos no mostraban `getZodiacSign()` ni cómo registrar un calendario custom (`ICalendarSystem`); el registro de locales (`registerAllLocales`/`getAvailableLocales`/`LOCALES_COUNT`) no estaba documentado; el entry point `/native` (build sin polyfill) no existía en absoluto en `/docs`.
  Criterio de aceptación: cada API pública mencionada arriba tiene un item en `docs.data.ts` con ejemplo de código real y verificado contra el código fuente actual.
  **Completado:** 5 items nuevos/expandidos en `docs.data.ts` (`advanced-format-plugin`, `plugin-authoring`, `calendars-overview` expandido, `locales` expandido, `native-mode`). De paso, se corrigió un ejemplo pre-existente en `plugin-mgr` que afirmaba un output (`"hace 1 hora y media"`) que la implementación real nunca produce.

- [x] `fix(docs-app): DocSection.vue nunca renderizaba item.examples sin playground`
  Objetivo: El código de ejemplo de un doc item solo se mostraba si `playground.enabled` estaba activo (se usa únicamente como fuente del sandbox StackBlitz) — cualquier item sin playground (como el nuevo `native-mode`, que no puede asumir `Temporal` global en el sandbox) dejaba su ejemplo completamente invisible.
  Criterio de aceptación: los ejemplos de código de un doc item son visibles con o sin playground activo.
  **Completado:** Añadido un bloque `<pre>` de fallback en `DocSection.vue`, mostrado solo cuando no hay playground (no cambia el layout de los items existentes que ya usan el sandbox).

## Hallazgo 2026-07-08 (pase de robustez en /docs — bugs reales encontrados al verificar ejemplos)

> A pedido de "dejar /docs mucho más robusta". Metodología: antes de documentar cualquier API, se verificó su comportamiento real ejecutándola — esto encontró 3 bugs genuinos que una documentación "de memoria" habría documentado como si funcionaran.

- [x] `fix(core): Duration.fromISO() descartaba silenciosamente el grupo de semanas`
  Objetivo: El regex de `fromISO()` capturaba `(\d+)W` pero la desestructuración `const [, negative, years, months, , days, ...]` saltaba ese grupo con una coma vacía — `Duration.fromISO('P2W3D')` siempre devolvía `weeks: 0`, perdiendo el valor sin error ni warning.
  Criterio de aceptación: `fromISO()` con semanas produce el mismo objeto que construir el `Duration` manualmente con `{ weeks }`.
  **Completado:** Corregida la desestructuración en `src/plugins/duration/index.ts` para capturar y mapear `weeks`. Tests en `test/coverage.test.ts` que antes solo hacían `toBeDefined()`/`toBeGreaterThanOrEqual()` ahora verifican valores exactos vía `toObject()`.

- [x] `fix(plugins): tokens de formato z/zzz (timezone) del AdvancedFormatPlugin siempre lanzaban`
  Objetivo: Descubierto al verificar el ejemplo de docs antes de escribirlo — `date.format('zzz')` lanzaba `TypeError: this.getTimezoneOffsetLong is not a function` (método inexistente en `TimeGuard`); `date.format('z')` llamaba a otro método inexistente (`getTimezoneOffset`) y además el regex (`zzz?`) nunca hacía match con un solo `z` (exigía 2+). Los dos tokens estaban completamente rotos desde su creación.
  Criterio de aceptación: `z` y `zzz` producen salida real usando métodos que sí existen en `TimeGuard`.
  **Completado:** `z` ahora llama a `getOffset()` (ej. "+09:00"), `zzz` a `getTimeZoneId()` (ej. "Asia/Tokyo", vacío si la instancia no tiene zona). Regex corregido a `zzz|z`. Regresión agregada en `test/plugins.test.ts`.

- [x] `fix(plugins): PluginManager.clear()/unuse() no revierten el monkey-patch de install()`
  Objetivo: Un plugin que parchea un método del prototype (`format`, en este caso) vía `install()` quedaba parchado PARA SIEMPRE; `clear()`/`unuse()` solo borraban el bookkeeping interno del Map, nunca deshacían el patch. Registrar el mismo plugin de nuevo después de un `clear()` (exactamente lo que hace cualquier `beforeEach` que reinstala plugins entre tests, o un ciclo de HMR en una app real) apilaba un wrapper NUEVO sobre el viejo en vez de reemplazarlo.
  Criterio de aceptación: agregar un hook `uninstall()` a `ITimeGuardPlugin` y que los 3 plugins built-in lo implementen restaurando el método original (o borrando lo agregado, según corresponda), y que `clear()`/`unuse()` lo invoquen.
  **Completado:** `ITimeGuardPlugin.uninstall?(timeGuard)` agregado como hook opcional (backward-compatible con plugins que no lo implementen). `PluginManager` ahora guarda `{ plugin, timeGuardClass }` por entrada (no solo el plugin) para poder invocar `uninstall(timeGuardClass)` correctamente desde `unuse()`/`clear()`. `RelativeTimePlugin`/`DurationPlugin` (que solo AGREGAN miembros inexistentes) borran esos miembros; `AdvancedFormatPlugin` (que ENVUELVE `format()` existente) guarda el método original en un `WeakMap<typeof TimeGuard, ...>` por clase y lo restaura. Verificado: 3 ciclos install→clear→install ya no corrompen `format()` (`zzz` sobre "Asia/Tokyo" sigue devolviendo `"Asia/Tokyo"`, no `"Asia/To[24yo]"`). Regresión en `test/plugins.test.ts`.
  **Hallazgo aparte (no arreglado):** Al reproducir el bug de arriba se encontró uno DISTINTO e independiente — el regex de tokens de `AdvancedFormatPlugin` no respeta el escape literal `[...]` de `format()`: escanea el patrón COMPLETO buscando letras-token (Q/D/o/w/W/g/G/k/X/x/z), incluso dentro de texto que el usuario ya envolvió en corchetes para protegerlo. Reproducible con una SOLA instalación (no depende del bug de arriba): `date.format('[Asia/Tokyo]')` → `"Asia/To[24yo]"` porque la "k" de "Tokyo" dispara el token `k` (hora 1-24) antes de que el formateador base procese el escape. No se corrigió esta sesión — es un bug de regex/parsing distinto, no de ciclo de vida de plugins.

- [x] `fix(docs): ejemplo de "Inicio Rápido" en /docs usaba una firma de add()/subtract() que no existe`
  Objetivo: `docs.data.ts` mostraba `specific.add(1, 'day')` / `specific.subtract(1, 'month')` (estilo dayjs) en el PRIMER ejemplo que ve cualquier visitante — la firma real es basada en objeto: `add({ day: 1 })` (`src/core.ts:888`).
  Criterio de aceptación: el ejemplo compila y corre tal cual contra la API real.
  **Completado:** Corregido a `add({ day: 1 })` / `subtract({ month: 1 })`.

- [x] `fix(frameworks): useTimeGuard() no reaccionaba a cambios de input en Vue/Solid/Qwik`
  Objetivo: Descubierto al escribir un ejemplo de docs para el hook — `useTimeGuard(input, config?)` está documentado como "instancia reactiva que se actualiza cuando input cambia", pero las 3 implementaciones intentaban "vigilar" `input` como si fuera una variable reactiva (`watch(() => input, ...)` en Vue, `createEffect(() => { const _input = input; ... })` en Solid, `track(() => input)` en Qwik) sin nunca DEREFERENCIAR un Ref/Accessor/Signal real — solo funcionaban si `input` era un valor plano fijo, en cuyo caso, por definición, nunca cambia. Verificado en vivo (Vue con `ref()`, Solid con `createSignal()` vía `node --conditions=browser` para evitar el stub no-op de `createEffect` en el build server/SSR de solid-js bajo Node): el valor devuelto NUNCA se actualizaba tras cambiar la fuente.
  Criterio de aceptación: pasar un Ref (Vue) / Accessor (Solid) / Signal (Qwik) como `input` hace que la instancia devuelta se recalcule cuando ese Ref/Accessor/Signal cambia; un valor plano sigue leyéndose una sola vez (comportamiento esperado, no un bug).
  **Completado:** Vue usa `toValue(input)` (requiere Vue ≥3.3, ya se pedía ≥3.5.34) dentro de los getters de `watch()`. Solid llama a `input` como función si `typeof input === 'function'` dentro de `createEffect` (registra el tracking de Solid al leerlo ahí). Qwik usa `isSignal(input)` + `track(() => input.value)`. Regresión agregada en `test/reactivity.test.ts` con el paquete real de Vue (no un mock) — Solid no tiene test automatizado (ver comentario en ese archivo: solid-js resuelve a su build server/SSR bajo el pipeline SSR de vitest incluso con `resolve.conditions` seteado, y perseguir eso no valía el esfuerzo dado que ya se verificó manualmente); Qwik tampoco (requiere un contenedor de componente real), pero sigue el mismo patrón `isSignal`/`track` que su propio `useCurrentTime` ya usa con éxito en el mismo archivo.

## Hallazgo 2026-07-09 (TimeGuard.now() mentía sobre ser UTC — desfase de horas real reportado por el usuario)

> Reportado directamente: "cuando uso TimeGuard.now() a veces me trae un desfase de 7 horas, mi hora actual es 10:36 pm y con TimeGuard me sale 5:36 a.m." — investigado con metodología de descarte (¿es el entorno del sandbox de StackBlitz? no. ¿es el WebContainer? no, ambos reportan la zona real correctamente) hasta encontrar el bug en el propio core.

- [x] `fix(core): TimeGuard.now() producía un PlainDateTime sin zona, etiquetado como UTC sin serlo`
  Objetivo: `TimeGuard.now()` usaba `Temporal.Now.plainDateTimeISO()` (sin info de zona/offset) y el config por defecto (`timezone: 'UTC'`) era solo una etiqueta/sentinela, no una conversión real. `format()` mostraba la hora local correctamente (lee los campos wall-clock directo), pero `toISOString()`, `getOffset()`, `getTimeZoneId()` y `format('utc'|'iso'|'rfc3339'|'rfc2822')` simplemente le pegaban una 'Z' literal a los dígitos LOCALES sin convertir nada — `TimeGuard.now().toISOString()` afirmaba ser UTC cuando en realidad era la hora local disfrazada. Si algo (una API, un `new Date(iso)`, otro visor en distinta zona) tomaba ese string al pie de la letra y lo reinterpretaba como UTC real, el resultado se desfasaba exactamente por el offset local — coincide con el síntoma reportado.
  Criterio de aceptación: `TimeGuard.now().toISOString()` debe coincidir con `new Date().toISOString()` (conversión UTC genuina); `format()` con patrones no-UTC debe seguir mostrando la hora local sin cambios; pasar una zona horaria explícita a `now({timezone})` debe calcular el instante actual TAL COMO SE OBSERVA en esa zona (no re-etiquetar la lectura local).
  **Completado:** El constructor de `TimeGuard` ahora trata `input === undefined` (el caso `now()`) por separado, usando `TemporalAdapter.nowInTimezone(config?.timezone)` — con zona expĺicita, usa `Temporal.Now.zonedDateTimeISO(zona)` (el instante actual, observado ahí); sin zona, usa la zona real del sistema (mismo wall-clock que ya mostraba `format()`, pero ahora con offset/zona genuinos adjuntos). `TemporalAdapter.toISOString()` y `TimeGuard.format()` (para los 4 presets que denotan UTC) ahora convierten vía `.toInstant()` cuando el valor es zonado, en vez de solo formatear los dígitos locales con una 'Z' pegada.
  **Bug de fondo encontrado en el camino:** `TemporalAdapter.isZonedDateTime()` buscaba una propiedad `timeZone` que el `ZonedDateTime` real de este polyfill NO tiene (usa `timeZoneId`) — el guard NUNCA hacía match con un valor zonado real, desde siempre. Y `isPlainDateTime()` era demasiado permisivo (un `ZonedDateTime` también tiene year/month/day/hour, así que también hacía match ahí), por lo que no distinguía de forma confiable un `PlainDateTime` genuino de uno zonado. Ambos corregidos.
  Verificado: `TimeGuard.now().toISOString()` coincide con `new Date().toISOString()` al minuto; `now({timezone:'Asia/Tokyo'})` y `now({timezone:'America/Bogota'})` calculados casi al mismo tiempo dan el MISMO instante en UTC pero distinta hora local, como corresponde. 649/649 tests pasan (5 nuevos agregados en `test/time-guard.test.ts`), sin regresiones — ningún test existente asumía la semántica vieja (solo verificaban forma `/Z$/`, nunca corrección real).

## 📊 Métricas Actuales

| Métrica | Valor | Meta |
|---------|-------|------|
| Lint errors | 0 | 0 ✅ |
| Lint warnings (any) | 0 | 0 ✅ |
| Tests | 649 | - |
| Statements coverage | 87.24% | >80% ✅ |
| Branches coverage | >80% | >80% ✅ |
| Functions coverage | 91.69% | >80% ✅ |
| Lines coverage | 87.62% | >80% ✅ |
