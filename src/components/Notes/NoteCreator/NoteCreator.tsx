import { useState } from "react";
import type { ChangeEvent } from "react";
import {
  DEFAULT_STICKY_SIZE,
  DEFAULT_STICKY_X,
  DEFAULT_STICKY_Y,
  MAX_POSITION_VALUE,
  MAX_STICKY_SIZE,
} from "../../../config/canvas";
import type { NoteDraft } from "../../../types/note";
import { Button, ButtonVariant, TextArea, TextField } from "../../forms";
import "./NoteCreator.css";

const DEFAULT_FORM = {
  text: "",
  size: DEFAULT_STICKY_SIZE,
  x: DEFAULT_STICKY_X,
  y: DEFAULT_STICKY_Y,
};

interface NoteCreatorProps {
  onCreate: (note: NoteDraft) => void;
}

function NoteCreator({ onCreate }: NoteCreatorProps) {
  const [form, setForm] = useState(DEFAULT_FORM);

  const clearForm = () => setForm(DEFAULT_FORM);

  const handleCreateNote = () => {
    onCreate({
      text: form.text,
      x: form.x,
      y: form.y,
      w: form.size,
      h: form.size,
    });
    clearForm();
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setForm({ ...form, text: e.target.value });

  const handleSizeChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, size: Number(e.target.value) });

  const handleXChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, x: Number(e.target.value) });

  const handleYChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, y: Number(e.target.value) });

  return (
    <section className="note-creator">
      <h2 className="note-creator-title">Sticky</h2>
      <TextArea label="text" value={form.text} onChange={handleTextChange} />
      <TextField
        label="size"
        type="number"
        max={MAX_STICKY_SIZE}
        value={form.size}
        onChange={handleSizeChange}
      />
      <div className="note-creator-fieldset">
        <span className="note-creator-fieldset-label">position</span>
        <div className="note-creator-grid">
          <TextField
            label="x"
            type="number"
            max={MAX_POSITION_VALUE}
            value={form.x}
            onChange={handleXChange}
          />
          <TextField
            label="y"
            type="number"
            max={MAX_POSITION_VALUE}
            value={form.y}
            onChange={handleYChange}
          />
        </div>
      </div>
      <div className="note-creator-actions">
        <Button variant={ButtonVariant.Primary} onClick={handleCreateNote}>
          Create Note
        </Button>
        <Button variant={ButtonVariant.Secondary} onClick={clearForm}>
          Clear Form
        </Button>
      </div>
    </section>
  );
}

export default NoteCreator;
