# Code Documentation

This document explains how the Sticky Notes codebase is organized and how the
pieces fit together.

## Project structure

```
stickynotes/
├── index.html              # HTML entry point; mounts the app into #root
├── src/
│   ├── main.tsx            # Bootstraps React and renders <App /> into #root
│   ├── App.tsx             # Root React component (renders <Notes />)
│   ├── components/         # UI components, one folder per component
│   │   └── forms/          # Reusable form fields sharing one field.css
│   ├── config/             # App constants (canvas size, default sticky geometry)
│   ├── store/              # Zustand state stores
│   ├── index.css           # Global styles: theme tokens, resets, layout base
│   └── vite-env.d.ts       # Vite type declarations for TypeScript
├── public/
│   └── favicon.svg         # Static asset served as-is at the site root
├── vite.config.ts          # Vite build/dev configuration
├── tsconfig*.json          # TypeScript configuration
└── eslint.config.js        # Lint rules
```

## Entry flow

1. **`index.html`** is the entry point. It contains a single mount node,
   `<div id="root">`, and loads `/src/main.tsx` as an ES module.
2. **`src/main.tsx`** finds `#root`, and renders the app inside React's
   `<StrictMode>` using `createRoot`. It also imports `index.css`, which is how
   the global stylesheet enters the bundle.
3. **`src/App.tsx`** is the root component; it renders the `Notes` feature.
   `Notes` composes the generic `Layout` shell (a centered 1024×768 two-column
   frame) with `Canvas` (left, where stickies live) and `Sidebar` (right, the
   selected sticky's info).

## Tooling

- **Vite** — dev server (with HMR) and production bundler.
- **React 19** — UI library.
- See [Installed libraries](../README.md#installed-libraries) in the README for
  the runtime/dev dependencies and why each is included.

## State management

We use [`zustand`](https://zustand.docs.pmnd.rs/) for shared app state — a small,
hook-based store with no provider/boilerplate. Stores live in
[`src/store/`](../src/store/), for this app we just have  one store 
file named `useNotesStore.ts`.

Components read exactly the slices they need, so they only re-render when those
slices change:

```tsx
import { useNotesStore } from './store/useNotesStore'

function AddNoteButton() {
  const addNote = useNotesStore((state) => state.addNote)
  return <button onClick={() => addNote('New note')}>Add</button>
}
```

See [`src/store/useNotesStore.ts`](../src/store/useNotesStore.ts) for the notes
store pattern (state + actions defined together in `create`).

## Forms

Reusable form-field components live in [`src/components/forms/`](../src/components/forms/).
They exist so that every input in the app shares **one set of CSS definitions**
— style is defined once and stays consistent, instead of restyling raw
`<input>` / `<textarea>` at each call site.

Each field is a thin, prop-transparent wrapper over its native element and
applies the shared `.field` class from
[`forms/field.css`](../src/components/forms/field.css):

- **`TextField`** extends `InputHTMLAttributes<HTMLInputElement>`, so it accepts
  all native input props (`value`, `onChange`, `type`, `placeholder`,
  `disabled`, `aria-*`, …).
- **`TextArea`** extends `TextareaHTMLAttributes<HTMLTextAreaElement>` the same
  way.
- **`Button`** wraps `<button>` (always `type="button"`) and takes a `variant`
  prop from the `ButtonVariant` enum — `Primary` (blue) or `Secondary` (white
  with a border), defaulting to `Primary`. It does not accept `className`;
  styling comes entirely from its own `Button.css`.

Both also accept an optional **`label`** prop (a `ReactNode`). When provided, the
field is wrapped by the shared [`Field`](../src/components/forms/Field/Field.tsx)
component, which renders a `<label>` correctly associated with the control via a
`useId`-generated id (or the caller's own `id` if passed). Without a `label`, the
bare control is returned unchanged.

A consumer `className` is merged after `field`, so callers can extend the shared
style without losing it. Import via the folder barrel:

```tsx
import { TextField, TextArea } from './components/forms'

<TextField label="Title" placeholder="Title" value={title} onChange={onTitleChange} />
<TextArea label="Note" placeholder="Write a note…" value={body} onChange={onBodyChange} />
```

To change how fields look everywhere, edit `forms/field.css` in one place.

## Using react-icons

We use [`react-icons`](https://react-icons.github.io/react-icons/) to reuse
third-party icons as React components. Import icons from a specific set path so
bundles stay lean (only the icons we use are included):

```tsx
import { FiPlus, FiTrash2 } from 'react-icons/fi' // Feather
import { MdPushPin } from 'react-icons/md'        // Material

<button><FiPlus size={18} /></button>
```

Icons inherit `currentColor`, so they automatically match the surrounding text
color / theme.

## How we use CSS

We use **plain global CSS** — no CSS-in-JS or utility framework.

- **Single global stylesheet:** [`src/index.css`](../src/index.css) holds the
  theme, resets, and base layout. It's imported once in
  [`src/main.tsx`](../src/main.tsx), which pulls it into the bundle.
- **CSS custom properties as theme tokens:** colors, fonts, and spacing live as
  variables on `:root` (e.g. `--text`, `--bg`, `--border`, `--sans`). Components
  reference them with `var(--token)` so the palette stays consistent and is easy
  to change in one place.
- **`color-scheme: light dark`** lets the browser adapt native UI (form
  controls, scrollbars) to the user's light/dark preference.
- **Minimum canvas size:** the `body` enforces a `min-width`/`min-height` of
  `1024×768` so the layout has a stable minimum footprint.

As the UI grows, prefer adding component-scoped styles alongside components
(e.g. `Component.css` imported by the component) while keeping shared tokens in
`index.css`.

## Common commands

| Command         | What it does                          |
| --------------- | ------------------------------------- |
| `npm run dev`   | Start the Vite dev server with HMR    |
| `npm run build` | Type-check and build for production   |
| `npm run preview` | Preview the production build locally |
| `npm run lint`  | Run ESLint over the project           |
