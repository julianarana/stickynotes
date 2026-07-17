import { useRef } from "react";
import type { PointerEvent } from "react";
import type { Note } from "../../../types/note";
import Sticky from "../Sticky";
import "./Canvas.css";

interface CanvasProps {
  notes: Note[];
  onMoveNote: (id: string, x: number, y: number) => void;
}

interface DragState {
  id: string;
  offsetX: number;
  offsetY: number;
  w: number;
  h: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

function Canvas({ notes, onMoveNote }: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);

  const handleDragStart = (e: PointerEvent<HTMLDivElement>, note: Note) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    dragRef.current = {
      id: note.id,
      offsetX: e.clientX - rect.left - note.x,
      offsetY: e.clientY - rect.top - note.y,
      w: note.w,
      h: note.h,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleDragMove = (e: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const canvas = canvasRef.current;
    if (!drag || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clamp(e.clientX - rect.left - drag.offsetX, 0, rect.width - drag.w);
    const y = clamp(e.clientY - rect.top - drag.offsetY, 0, rect.height - drag.h);
    onMoveNote(drag.id, Math.round(x), Math.round(y));
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
