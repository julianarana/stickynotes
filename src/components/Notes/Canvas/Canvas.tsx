import { useCallback, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
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
  onRemoveNote: (id: string) => void;
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

function Canvas({
  notes,
  onMoveNote,
  onResizeNote,
  onRemoveNote,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const trashRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const overTrashRef = useRef(false);
  const [isOverTrash, setIsOverTrash] = useState(false);

  const setOverTrash = useCallback((over: boolean) => {
    overTrashRef.current = over;
    setIsOverTrash(over);
  }, []);


  // Calculates if the sticky being dragges is over the trash zone.
  const isOverTrashZone = useCallback(
    (rect: DOMRect, x: number, y: number, w: number, h: number) => {
      const trash = trashRef.current;
      if (!trash) return false;
      const t = trash.getBoundingClientRect();
      const tLeft = t.left - rect.left;
      const tTop = t.top - rect.top;
      return (
        x < tLeft + t.width &&
        x + w > tLeft &&
        y < tTop + t.height &&
        y + h > tTop
      );
    },
    [],
  );

  // Callback for handling the drag start. Finds the mode of dragging (move or resizing)
  // creates the reference for the note so that appluyMove can affect directly the Note.
  const handleDragStart = useCallback(
    (e: PointerEvent<HTMLDivElement>, note: Note) => {
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
    },
    [],
  );

  // Updates the position of the sicky calculating the size of the sticky and the related position fo the mouse.
  const applyMove = useCallback(
    (drag: DragState, rect: DOMRect, px: number, py: number) => {
      const x = clamp(px - drag.offsetX, 0, rect.width - drag.w);
      const y = clamp(py - drag.offsetY, 0, rect.height - drag.h);
      setOverTrash(isOverTrashZone(rect, x, y, drag.w, drag.h));
      onMoveNote(drag.id, Math.round(x), Math.round(y));
    },
    [isOverTrashZone, setOverTrash, onMoveNote],
  );

  // This updates the size of the sticky being dragged. It calculates the new size based on the
  //  corner being dragged and the position of the mouse.
  const applyResize = useCallback(
    (drag: DragState, corner: Corner, rect: DOMRect, px: number, py: number) => {
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
    },
    [onResizeNote, onMoveNote],
  );

    //Handler for the movement of the sticky. It calculates the position of the mouse
  // calculates if is over the trash 
  // and decides whether is moving or resizing depending on the mode. 
  // This ends up calling the correct function to update the note's position or size.
  const handleDragMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      const canvas = canvasRef.current;
      if (!drag || !canvas) return;
      // No button pressed means a pointer-up was missed while the pointer was
      // off the sticky — abandon the drag so hovering back over it doesn't
      // keep moving/resizing.
      if (e.buttons === 0) {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
        dragRef.current = null;
        setOverTrash(false);
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;

      if (drag.mode.type === "move") {
        applyMove(drag, rect, px, py);
      } else {
        applyResize(drag, drag.mode.corner, rect, px, py);
      }
    },
    [applyMove, applyResize, setOverTrash],
  );


  // Callback for handling the drag end. It checks if the sticky is over the trash zone and removes it if so.
  // Finally clears the reference of the sticky.
  const handleDragEnd = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag) return;
      e.currentTarget.releasePointerCapture(e.pointerId);
      if (drag.mode.type === "move" && overTrashRef.current) {
        onRemoveNote(drag.id);
      }
      dragRef.current = null;
      setOverTrash(false);
    },
    [onRemoveNote, setOverTrash],
  );

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
      <div
        ref={trashRef}
        className={
          isOverTrash ? "canvas-trash canvas-trash--active" : "canvas-trash"
        }
      >
        <FaRegTrashCan size={22} />
      </div>
    </div>
  );
}

export default Canvas;
