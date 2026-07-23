import { useId, useState } from "react";
import type { ChangeEvent } from "react";
import {
  DEFAULT_STICKY_SIZE,
  DEFAULT_STICKY_X,
  DEFAULT_STICKY_Y,
  MAX_POSITION_X,
  MAX_POSITION_Y,
  MAX_STICKY_SIZE,
  MAX_TEXT_LENGTH,
  MIN_POSITION_VALUE,
  MIN_STICKY_SIZE,
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

const isInRange = (value: number, min: number, max: number) =>
  value >= min && value <= max;

interface NoteCreatorProps {
  onCreate: (note: NoteDraft) => void;
}

function NoteCreator({ onCreate }: NoteCreatorProps) {
  const [form, setForm] = useState(DEFAULT_FORM);

  const titleId = useId();
  const textErrorId = useId();
  const sizeErrorId = useId();
  const xErrorId = useId();
  const yErrorId = useId();

  const errors = {
    text: form.text.length > MAX_TEXT_LENGTH,
    size: !isInRange(form.size, MIN_STICKY_SIZE, MAX_STICKY_SIZE),
    x: !isInRange(form.x, MIN_POSITION_VALUE, MAX_POSITION_X),
    y: !isInRange(form.y, MIN_POSITION_VALUE, MAX_POSITION_Y),
  };
  const isValid = !errors.text && !errors.size && !errors.x && !errors.y;

  const clearForm = () => setForm(DEFAULT_FORM);

  const handleCreateNote = () => {
    if (!isValid) return;
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
    <section className="note-creator" aria-labelledby={titleId}>
      <h2 className="note-creator-title" id={titleId}>
        Sticky
      </h2>
      <TextArea
        label="text"
        value={form.text}
        onChange={handleTextChange}
        maxLength={MAX_TEXT_LENGTH}
        aria-invalid={errors.text}
        aria-describedby={errors.text ? textErrorId : undefined}
      />
      {errors.text && (
        <p className="note-creator-error" id={textErrorId} role="alert">
          Text must be at most {MAX_TEXT_LENGTH} characters.
        </p>
      )}
      <TextField
        label="size"
        type="number"
        min={MIN_STICKY_SIZE}
        max={MAX_STICKY_SIZE}
        value={form.size}
        onChange={handleSizeChange}
        aria-invalid={errors.size}
        aria-describedby={errors.size ? sizeErrorId : undefined}
      />
      {errors.size && (
        <p className="note-creator-error" id={sizeErrorId} role="alert">
          Size must be between {MIN_STICKY_SIZE} and {MAX_STICKY_SIZE}.
        </p>
      )}
      <div className="note-creator-fieldset">
        <span
          className="note-creator-fieldset-label"
          id={`${titleId}-position`}
        >
          position
        </span>
        <div
          className="note-creator-grid"
          role="group"
          aria-labelledby={`${titleId}-position`}
        >
          <TextField
            label="x"
            type="number"
            min={MIN_POSITION_VALUE}
            max={MAX_POSITION_X}
            value={form.x}
            onChange={handleXChange}
            aria-invalid={errors.x}
            aria-describedby={errors.x ? xErrorId : undefined}
          />
          <TextField
            label="y"
            type="number"
            min={MIN_POSITION_VALUE}
            max={MAX_POSITION_Y}
            value={form.y}
            onChange={handleYChange}
            aria-invalid={errors.y}
            aria-describedby={errors.y ? yErrorId : undefined}
          />
        </div>
        {errors.x && (
          <p className="note-creator-error" id={xErrorId} role="alert">
            X must be between {MIN_POSITION_VALUE} and {MAX_POSITION_X}.
          </p>
        )}
        {errors.y && (
          <p className="note-creator-error" id={yErrorId} role="alert">
            Y must be between {MIN_POSITION_VALUE} and {MAX_POSITION_Y}.
          </p>
        )}
      </div>
      <div className="note-creator-actions">
        <Button
          variant={ButtonVariant.Primary}
          onClick={handleCreateNote}
          disabled={!isValid}
          aria-disabled={!isValid}
        >
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
