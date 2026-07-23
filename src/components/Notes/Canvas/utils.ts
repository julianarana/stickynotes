import type { Note } from "../../../types/note";

export type Corner = "nw" | "ne" | "sw" | "se";

export type DragMode = { type: "move" } | { type: "resize"; corner: Corner };

// In canvas sticky note version the deninition of the style is done as part of the canvas drawing.
// The following constants define the visual styles of a note.
const HANDLE_SIZE = 16;
const NOTE_BG = "#fef3c7";
const NOTE_BORDER = "rgba(0, 0, 0, 0.08)";
const NOTE_TEXT = "#08060d";
const NOTE_RADIUS = 4;
const NOTE_PADDING = 10;
const FONT = "14px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
const LINE_HEIGHT = 19;

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));


// This one does the drwaing of the rectangles with the rounded corners.
const roundRectPath = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) => {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
};

// Canvas has no text wrapping, so lay text out by hand: honor explicit newlines,
// wrap on words, and hard-break words longer than the box (like word-break).
const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] => {
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    if (paragraph === "") {
      lines.push("");
      continue;
    }
    let line = "";
    for (const word of paragraph.split(" ")) {
      const candidate = line ? `${line} ${word}` : word;
      if (ctx.measureText(candidate).width <= maxWidth) {
        line = candidate;
        continue;
      }
      if (line) lines.push(line);
      if (ctx.measureText(word).width <= maxWidth) {
        line = word;
        continue;
      }
      let chunk = "";
      for (const char of word) {
        if (ctx.measureText(chunk + char).width <= maxWidth) {
          chunk += char;
        } else {
          if (chunk) lines.push(chunk);
          chunk = char;
        }
      }
      line = chunk;
    }
    lines.push(line);
  }
  return lines;
};

// The core of the the drawing of a note in a the canvas. This is called for each note in the canvas to draw it on the canvas.
export const drawNote = (ctx: CanvasRenderingContext2D, note: Note) => {
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.12)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;
  roundRectPath(ctx, note.x, note.y, note.w, note.h, NOTE_RADIUS);
  ctx.fillStyle = NOTE_BG;
  ctx.fill();
  ctx.restore();

  roundRectPath(ctx, note.x, note.y, note.w, note.h, NOTE_RADIUS);
  ctx.strokeStyle = NOTE_BORDER;
  ctx.lineWidth = 1;
  ctx.stroke();

  if (!note.text) return;
  ctx.save();
  roundRectPath(ctx, note.x, note.y, note.w, note.h, NOTE_RADIUS);
  ctx.clip();
  ctx.fillStyle = NOTE_TEXT;
  ctx.font = FONT;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const lines = wrapText(ctx, note.text, note.w - NOTE_PADDING * 2);
  const cx = note.x + note.w / 2;
  let ty =
    note.y + note.h / 2 - (lines.length * LINE_HEIGHT) / 2 + LINE_HEIGHT / 2;
  for (const line of lines) {
    ctx.fillText(line, cx, ty);
    ty += LINE_HEIGHT;
  }
  ctx.restore();
};

// Get' the corner at which the user is pointing in a single note. So that the resize function can work on the proper direcction.
export const cornerAt = (note: Note, px: number, py: number): Corner | null => {
  if (
    px < note.x ||
    px > note.x + note.w ||
    py < note.y ||
    py > note.y + note.h
  ) {
    return null;
  }
  const left = px <= note.x + HANDLE_SIZE;
  const right = px >= note.x + note.w - HANDLE_SIZE;
  const top = py <= note.y + HANDLE_SIZE;
  const bottom = py >= note.y + note.h - HANDLE_SIZE;
  if (top && left) return "nw";
  if (top && right) return "ne";
  if (bottom && left) return "sw";
  if (bottom && right) return "se";
  return null;
};

// This has to be valculated in code because the canvas has no DOM elements to style.
// The cursor is set on the canvas element itself.
export const cursorFor = (mode: DragMode): string => {
  if (mode.type === "move") return "grab";
  return mode.corner === "nw" || mode.corner === "se"
    ? "nwse-resize"
    : "nesw-resize";
};
