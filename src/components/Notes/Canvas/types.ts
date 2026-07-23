import type { Note } from "../../../types/note";
import type { DragMode } from "./utils";

export interface NoteCanvasProps {
  notes: Note[];
  onMoveNote: (id: string, x: number, y: number) => void;
  onResizeNote: (id: string, w: number, h: number) => void;
  onRemoveNote: (id: string) => void;
}

export interface DragState {
  id: string;
  mode: DragMode;
  offsetX: number;
  offsetY: number;
  x: number;
  y: number;
  w: number;
  h: number;
}
