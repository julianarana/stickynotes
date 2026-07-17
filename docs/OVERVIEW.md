# Architecture Overview

Sticky Notes is a small single-page React + TypeScript app (built with Vite) for
placing notes on a board. The screen is a fixed 1024×768 workspace split in two:
a **canvas** on the left where sticky notes live — you can drag them around,
resize them from their corners, and drop them on a trash zone to delete — and a
**form** on the right for creating new ones. If you're new to the codebase, that
left/right split is the mental model to start from.

I centered the design on one simple rule: **there is a single source of truth for
the notes, and only one component talks to it.** All note data lives in a Zustand
store, and the `Notes` component (the feature root) is the only place that reads
from it. From there, data flows *down* to child components as plain props, and
changes flow *back up* as callbacks that call store actions. So `Canvas` and the
form never mutate state directly — they signal intent ("move this note", "create
this note") and the store does the actual work, like assigning each note its id.
This keeps the leaf components pure and easy to reason about: given the same
props, they always render the same thing.

Around that core, I organized the code by responsibility. UI lives in
`src/components/` (one folder per component), the state and its actions live in
`src/store/`, shared data shapes like `Note` live in `src/types/` , and tunable
constants like the canvas size and default note dimensions live in `src/config/`
rather than being scattered as magic numbers. Reusable form inputs share a single
stylesheet so every field looks consistent. A few conventions keep things tidy —
components are imported through folder barrels, and interaction callbacks are
always named functions rather than inline arrows.

For file-level notes, see [CODE.md](CODE.md).
