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

| Library                                                     | Why it's here                                                                                                                  |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| [`react`](https://react.dev/) / `react-dom`                 | UI library used to build and render the app.                                                                                   |
| [`zustand`](https://zustand.docs.pmnd.rs/)                  | Lightweight state management for shared app state (the "state handler").                                                       |
| [`react-icons`](https://react-icons.github.io/react-icons/) | Reuse third-party icons (Feather, Material, etc.) as React components, importing per-set so only the icons we use are bundled. |

### Dev dependencies

| Library                                              | Why it's here                                                    |
| ---------------------------------------------------- | ---------------------------------------------------------------- |
| [`typescript`](https://www.typescriptlang.org/)      | Required — the project is written in TypeScript for type safety. |
| [`vite`](https://vite.dev/) + `@vitejs/plugin-react` | Dev server (HMR) and production bundler.                         |
| `eslint` (+ plugins) & `@types/*`                    | Linting and React/TypeScript type definitions.                   |

For icon usage and the CSS approach, see the [code documentation](docs/CODE.md).

## Features Implementd

### Function requirements

[x] Create a new note of the specified size at the specified position.
[x] Change note size by dragging.
[x] Move a note by dragging.
[x] Remove a note by dragging it over a predefined "trash" zone.

### Non-functional requirements

You are encouraged to think about the best UI for these features that is
possible to implement in the specified timeframe.
System requirements:
[x] The web application is intended to be used on desktop. Minimum screen
resolution: 1024x768.
[x] The following browsers should be supported: latest versions of Google Chrome
(Windows and Mac), Mozilla Firefox (all platforms), Microsoft Edge.
[x] Typescript language
[x] No stock components used (except from icons library)
