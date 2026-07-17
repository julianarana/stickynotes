import { useRef } from "react";
import type { PointerEvent } from "react";
import { MIN_STICKY_SIZE } from "../../../config/canvas";
import type { Note } from "../../../types/note";
import Sticky from "../Sticky";
import "./Canvas.css";

type Corner = "nw" | "ne" | "sw" | "se";

type DragMode = { type: "move" } | { type: "resize"; corner: Corner };

interface CanvasProps {
  notes: Note[];
  onMoveNote: (id: string, x: number, y: number) => void;
  onResizeNote: (id: string, w: number, h: number) => void;
}

interface DragState {
  id: string;
  mode: DragMode;
  offsetX: number;
  offsetY: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

// Resolves which gesture a pointer-down starts: pressing a corner handle
// (data-corner) resizes; anywhere else on the sticky moves it.
const resolveDragMode = (target: EventTarget | null): DragMode => {
  const corner = (target as HTMLElement | null)?.dataset?.corner as
    | Corner
    | undefined;
  return corner ? { type: "resize", corner } : { type: "move" };
};

function Canvas({ notes, onMoveNote, onResizeNote }: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);

  const handleDragStart = (e: PointerEvent<HTMLDivElement>, note: Note) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    dragRef.current = {
      id: note.id,
      mode: resolveDragMode(e.target),
      offsetX: e.clientX - rect.left - note.x,
      offsetY: e.clientY - rect.top - note.y,
      x: note.x,
      y: note.y,
      w: note.w,
      h: note.h,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const applyMove = (
    drag: DragState,
    rect: DOMRect,
    px: number,
    py: number,
  ) => {
    const x = clamp(px - drag.offsetX, 0, rect.width - drag.w);
    const y = clamp(py - drag.offsetY, 0, rect.height - drag.h);
    onMoveNote(drag.id, Math.round(x), Math.round(y));
  };

  const applyResize = (
    drag: DragState,
    corner: Corner,
    rect: DOMRect,
    px: number,
    py: number,
  ) => {
    const isNorth = corner[0] === "n";
    const isWest = corner[1] === "w";
    // The corner opposite the one being dragged stays fixed (the anchor).
    const anchorX = isWest ? drag.x + drag.w : drag.x;
    const anchorY = isNorth ? drag.y + drag.h : drag.y;

    const w = clamp(
      isWest ? anchorX - px : px - anchorX,
      MIN_STICKY_SIZE,
      isWest ? anchorX : rect.width - anchorX,
    );
    const h = clamp(
      isNorth ? anchorY - py : py - anchorY,
      MIN_STICKY_SIZE,
      isNorth ? anchorY : rect.height - anchorY,
    );

    const x = isWest ? anchorX - w : anchorX;
    const y = isNorth ? anchorY - h : anchorY;

    onResizeNote(drag.id, Math.round(w), Math.round(h));
    onMoveNote(drag.id, Math.round(x), Math.round(y));
  };

  const handleDragMove = (e: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const canvas = canvasRef.current;
    if (!drag || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    if (drag.mode.type === "move") {
      applyMove(drag, rect, px, py);
    } else {
      applyResize(drag, drag.mode.corner, rect, px, py);
    }
  };

  const handleDragEnd = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    dragRef.current = null;
  };

  return (
    <div className="canvas" ref={canvasRef}>
      {notes.map((note) => (
        <Sticky
          key={note.id}
          note={note}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
        />
      ))}
    </div>
  );
}

export default Canvas;
