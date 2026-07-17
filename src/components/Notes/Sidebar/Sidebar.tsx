import { useState } from "react";
import type { ChangeEvent } from "react";
import {
  DEFAULT_STICKY_SIZE,
  DEFAULT_STICKY_X,
  DEFAULT_STICKY_Y,
  MAX_POSITION_VALUE,
  MAX_STICKY_SIZE,
} from "../../../config/canvas";
import { Button, ButtonVariant, TextArea, TextField } from "../../forms";
import "./Sidebar.css";

const DEFAULT_FORM = {
  text: "",
  size: DEFAULT_STICKY_SIZE,
  x: DEFAULT_STICKY_X,
  y: DEFAULT_STICKY_Y,
};

function Sidebar() {
  const [form, setForm] = useState(DEFAULT_FORM);

  const clearForm = () => setForm(DEFAULT_FORM);

  const handleCreateNote = () => {
    // Add additional functionality here before clearing (e.g. create the sticky).
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
    <aside className="sidebar">
      <h2 className="sidebar-title">Sticky</h2>
      <TextArea label="text" value={form.text} onChange={handleTextChange} />
      <TextField
        label="size"
        type="number"
        max={MAX_STICKY_SIZE}
        value={form.size}
        onChange={handleSizeChange}
      />
      <div className="sidebar-fieldset">
        <span className="sidebar-fieldset-label">position</span>
        <div className="sidebar-grid">
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
      <div className="sidebar-actions">
        <Button variant={ButtonVariant.Primary} onClick={handleCreateNote}>
          Create Note
        </Button>
        <Button variant={ButtonVariant.Secondary} onClick={clearForm}>
          Clear Form
        </Button>
      </div>
    </aside>
  );
}

export default Sidebar;
