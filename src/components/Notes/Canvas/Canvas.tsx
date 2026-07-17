import type { Note } from "../../../types/note";
import Sticky from "../Sticky";
import "./Canvas.css";

interface CanvasProps {
  notes: Note[];
}

function Canvas({ notes }: CanvasProps) {
  return (
    <div className="canvas">
      {notes.map((note) => (
        <Sticky key={note.id} note={note} />
      ))}
    </div>
  );
}

export default Canvas;
