import type { PointerEvent } from "react";
import type { Note } from "../../../types/note";
import "./Sticky.css";

interface StickyProps {
  note: Note;
  onDragStart: (e: PointerEvent<HTMLDivElement>, note: Note) => void;
  onDragMove: (e: PointerEvent<HTMLDivElement>) => void;
  onDragEnd: (e: PointerEvent<HTMLDivElement>) => void;
}

function Sticky({ note, onDragStart, onDragMove, onDragEnd }: StickyProps) {
  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) =>
    onDragStart(e, note);

  return (
    <div
      className="sticky"
      style={{
        left: note.x,
        top: note.y,
        width: note.w,
        height: note.h,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={onDragMove}
      onPointerUp={onDragEnd}
    >
      {note.text}
    </div>
  );
}

export default Sticky;
