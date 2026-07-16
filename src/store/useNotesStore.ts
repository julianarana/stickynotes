import { create } from "zustand";

// Default size (in pixels) of a newly created note.
const DEFAULT_NOTE_WIDTH = 200;
const DEFAULT_NOTE_HEIGHT = 200;

// Default position (in pixels) of a newly created note.
const DEFAULT_NOTE_X = 0;
const DEFAULT_NOTE_Y = 0;

export interface Note {
  id: string; // THis unique identifier is  used to identify each note in the store - it uses internal zustand crypto UUID generator.
  text: string;
  x: number; // Horizontal position of the note in pixels.
  y: number; // Vertical position of the note in pixels.
  w: number; // Width of the note in pixels.
  h: number; // Height of the note in pixels.
}

interface NotesState {
  notes: Note[];
  addNote: (text: string) => void;
  updateNote: (id: string, text: string) => void;
  moveNote: (id: string, x: number, y: number) => void;
  resizeNote: (id: string, w: number, h: number) => void;
  removeNote: (id: string) => void;
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
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
