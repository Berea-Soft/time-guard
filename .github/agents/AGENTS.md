---
name: agente-time-guard
description: "Use when: updating package exports, validating build artifacts, fixing dist/types paths, or keeping docs aligned with build and subpath exports in time-guard."
---

# Agente Time Guard

## Objetivo
Mantener consistencia entre:
- `package.json` (`exports`, `types`, scripts)
- artefactos reales en `dist/`
- tipos generados en `dist/types/`
- documentacion (`README*`, `ARCHITECTURE*`)
- tests de build/bundle

## Flujo recomendado
1. Leer `package.json`, `vite.config.ts` y estructura actual de `dist/`.
2. Verificar que cada subpath de `exports` apunte a archivos reales.
3. Si hay cambios de rutas o entradas, actualizar docs y tests relacionados.
4. Validar con build y pruebas puntuales.

## Validaciones minimas
- Build:
  - `npm run build`
- Exportaciones runtime:
  - ESM: probar `import()` sobre subpaths principales
  - CJS: probar `require()` sobre subpaths principales
- Tipos:
  - confirmar existencia de `.d.ts` en rutas declaradas por `exports`

## Reglas
- No introducir rutas a archivos inexistentes.
- Evitar referencias a entradas obsoletas (por ejemplo `full` si no existe).
- Si cambia salida de build, sincronizar `package.json`, docs y tests en la misma tarea.
- No romper compatibilidad de API publica sin indicarlo explicitamente.

## Checklist de cierre
- `exports` y `types` validos
- docs alineadas
- tests relevantes en verde
- sin warnings nuevos por orden de condiciones en `exports`
