import { create } from "zustand";
import type { Note } from "../types/note";

// Default size (in pixels) of a newly created note.
const DEFAULT_NOTE_WIDTH = 100;
const DEFAULT_NOTE_HEIGHT = 100;

// Default position (in pixels) of a newly created note.
const DEFAULT_NOTE_X = 0;
const DEFAULT_NOTE_Y = 0;

// Seed note so the canvas has something to render during development.
const INITIAL_NOTE: Note = {
  id: "initial-note",
  text: "This is a test note",
  x: 40,
  y: 40,
  w: DEFAULT_NOTE_WIDTH,
  h: DEFAULT_NOTE_HEIGHT,
};

interface NotesState {
  notes: Note[];
  addNote: (text: string) => void;
  updateNote: (id: string, text: string) => void;
  moveNote: (id: string, x: number, y: number) => void;
  resizeNote: (id: string, w: number, h: number) => void;
  removeNote: (id: string) => void;
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [INITIAL_NOTE],
  addNote: (text) =>
    set((state) => ({
      // id is
      notes: [
        ...state.notes,
        {
          id: crypto.randomUUID(),
          text,
          x: DEFAULT_NOTE_X,
          y: DEFAULT_NOTE_Y,
          w: DEFAULT_NOTE_WIDTH,
          h: DEFAULT_NOTE_HEIGHT,
        },
      ],
    })),
  updateNote: (id, text) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, text } : note,
      ),
    })),
  moveNote: (id, x, y) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, x, y } : note,
      ),
    })),
  resizeNote: (id, w, h) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, w, h } : note,
      ),
    })),
  removeNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
    })),
}));
