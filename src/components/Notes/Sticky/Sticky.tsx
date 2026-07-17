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
      // Compatible with all the browsers https://caniuse.com/?search=pointerdown
      onPointerDown={handlePointerDown}
      // Compatible with all the browsers https://caniuse.com/?search=pointermove
      onPointerMove={onDragMove}
      // Compatible with all the browsers https://caniuse.com/?search=pointerup
      onPointerUp={onDragEnd}
    >
      {note.text}
      <span className="sticky-handle sticky-handle--nw" data-corner="nw" />
      <span className="sticky-handle sticky-handle--ne" data-corner="ne" />
      <span className="sticky-handle sticky-handle--sw" data-corner="sw" />
      <span className="sticky-handle sticky-handle--se" data-corner="se" />
    </div>
  );
}

export default Sticky;
