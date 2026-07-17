import { useNotesStore } from "../../store/useNotesStore";
import Layout from "../Layout";
import Canvas from "./Canvas";
import NoteCreator from "./NoteCreator";

function Notes() {
  const notes = useNotesStore((state) => state.notes);
  const addNote = useNotesStore((state) => state.addNote);
  const moveNote = useNotesStore((state) => state.moveNote);
  const resizeNote = useNotesStore((state) => state.resizeNote);
  const removeNote = useNotesStore((state) => state.removeNote);

  return (
    <Layout
      left={
        <Canvas
          notes={notes}
          onMoveNote={moveNote}
          onResizeNote={resizeNote}
          onRemoveNote={removeNote}
        />
      }
      right={<NoteCreator onCreate={addNote} />}
    />
  );
}

export default Notes;
