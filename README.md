# Sticky Notes

A React + Vite + TypeScript app for sticky notes.

## Documentation

- [Architecture overview](docs/OVERVIEW.md) — a short, prose introduction to how the app is built.
- [Code documentation](docs/CODE.md) — project structure, entry flow, and how the code fits together.

## Getting started

```bash
npm install
npm run dev
```

## Installed libraries

### Runtime dependencies

| Library                                            | Why it's here                                                                    |
| -------------------------------------------------- | -------------------------------------------------------------------------------- |
| [`react`](https://react.dev/) / `react-dom`        | UI library used to build and render the app.                                     |
| [`zustand`](https://zustand.docs.pmnd.rs/)         | Lightweight state management for shared app state (the "state handler").          |
| [`react-icons`](https://react-icons.github.io/react-icons/) | Reuse third-party icons (Feather, Material, etc.) as React components, importing per-set so only the icons we use are bundled. |

### Dev dependencies

| Library                                       | Why it's here                                                                 |
| --------------------------------------------- | ----------------------------------------------------------------------------- |
| [`typescript`](https://www.typescriptlang.org/) | Required — the project is written in TypeScript for type safety.            |
| [`vite`](https://vite.dev/) + `@vitejs/plugin-react` | Dev server (HMR) and production bundler.                              |
| `eslint` (+ plugins) & `@types/*`             | Linting and React/TypeScript type definitions.                                |

For icon usage and the CSS approach, see the [code documentation](docs/CODE.md).
