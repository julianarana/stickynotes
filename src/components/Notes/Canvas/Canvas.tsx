import { FaRegTrashCan } from "react-icons/fa6";
import { useNoteCanvas } from "./useNoteCanvas";
import type { NoteCanvasProps } from "./types";
import "./Canvas.css";

function Canvas(props: NoteCanvasProps) {
  const {
    canvasRef,
    trashRef,
    isOverTrash,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useNoteCanvas(props);

  return (
    <div className="canvas">
      <canvas
        ref={canvasRef}
        className="canvas-surface"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />
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
