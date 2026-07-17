import { useNotesStore } from "../../store/useNotesStore";
import Layout from "../Layout";
import Canvas from "./Canvas";
import NoteCreator from "./NoteCreator";

function Notes() {
  const notes = useNotesStore((state) => state.notes);
  const addNote = useNotesStore((state) => state.addNote);

  return (
    <Layout
      left={<Canvas notes={notes} />}
      right={<NoteCreator onCreate={addNote} />}
    />
  );
}

export default Notes;
