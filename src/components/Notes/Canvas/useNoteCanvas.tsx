import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { MIN_STICKY_SIZE } from "../../../config/canvas";
import type { Note } from "../../../types/note";
import { clamp, cornerAt, cursorFor, drawNote } from "./utils";
import type { Corner, DragMode } from "./utils";
import type { DragState, NoteCanvasProps } from "./types";

// Owns all of the canvas drawing and pointer-interaction state, exposing only
// the refs, flags, and handlers the Canvas component needs to render.
export function useNoteCanvas({
  notes,
  onMoveNote,
  onResizeNote,
  onRemoveNote,
}: NoteCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trashRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const overTrashRef = useRef(false);
  const [isOverTrash, setIsOverTrash] = useState(false);

  const setOverTrash = useCallback((over: boolean) => {
    overTrashRef.current = over;
    setIsOverTrash(over);
  }, []);

  const isOverTrashZone = useCallback(
    (rect: DOMRect, x: number, y: number, w: number, h: number) => {
      const trash = trashRef.current;
      if (!trash) return false;
      const t = trash.getBoundingClientRect();
      const tLeft = t.left - rect.left;
      const tTop = t.top - rect.top;
      return (
        x < tLeft + t.width &&
        x + w > tLeft &&
        y < tTop + t.height &&
        y + h > tTop
      );
    },
    [],
  );

  // Paints every note onto the canvas, handling device-pixel-ratio so text
  // stays crisp on retina displays. Re-runs whenever `notes` changes.
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;
    const bw = Math.round(canvasWidth * dpr);
    const bh = Math.round(canvasHeight * dpr);
    if (canvas.width !== bw) canvas.width = bw;
    if (canvas.height !== bh) canvas.height = bh;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    for (const note of notes) drawNote(ctx, note);
  }, [notes]);

  // Top-most note (and gesture) under a point — replaces DOM/data-corner hit-testing.
  const hitTest = useCallback(
    (px: number, py: number): { note: Note; mode: DragMode } | null => {
      for (let i = notes.length - 1; i >= 0; i--) {
        const note = notes[i];
        if (
          px >= note.x &&
          px <= note.x + note.w &&
          py >= note.y &&
          py <= note.y + note.h
        ) {
          const corner = cornerAt(note, px, py);
          return {
            note,
            mode: corner ? { type: "resize", corner } : { type: "move" },
          };
        }
      }
      return null;
    },
    [notes],
  );

  const updateCursor = useCallback(
    (px: number, py: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const hit = hitTest(px, py);
      canvas.style.cursor = hit ? cursorFor(hit.mode) : "default";
    },
    [hitTest],
  );

  const applyMove = useCallback(
    (drag: DragState, rect: DOMRect, px: number, py: number) => {
      const x = clamp(px - drag.offsetX, 0, rect.width - drag.w);
      const y = clamp(py - drag.offsetY, 0, rect.height - drag.h);
      setOverTrash(isOverTrashZone(rect, x, y, drag.w, drag.h));
      onMoveNote(drag.id, Math.round(x), Math.round(y));
    },
    [isOverTrashZone, setOverTrash, onMoveNote],
  );

  const applyResize = useCallback(
    (drag: DragState, corner: Corner, rect: DOMRect, px: number, py: number) => {
      const isNorth = corner[0] === "n";
      const isWest = corner[1] === "w";
      // The corner opposite the one being dragged stays fixed (the anchor).
      const anchorX = isWest ? drag.x + drag.w : drag.x;
      const anchorY = isNorth ? drag.y + drag.h : drag.y;

      const w = clamp(
        isWest ? anchorX - px : px - anchorX,
        MIN_STICKY_SIZE,
        isWest ? anchorX : rect.width - anchorX,
      );
      const h = clamp(
        isNorth ? anchorY - py : py - anchorY,
        MIN_STICKY_SIZE,
        isNorth ? anchorY : rect.height - anchorY,
      );

      const x = isWest ? anchorX - w : anchorX;
      const y = isNorth ? anchorY - h : anchorY;

      onResizeNote(drag.id, Math.round(w), Math.round(h));
      onMoveNote(drag.id, Math.round(x), Math.round(y));
    },
    [onResizeNote, onMoveNote],
  );

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const hit = hitTest(px, py);
      if (!hit) return;
      dragRef.current = {
        id: hit.note.id,
        mode: hit.mode,
        offsetX: px - hit.note.x,
        offsetY: py - hit.note.y,
        x: hit.note.x,
        y: hit.note.y,
        w: hit.note.w,
        h: hit.note.h,
      };
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor =
        hit.mode.type === "move" ? "grabbing" : cursorFor(hit.mode);
    },
    [hitTest],
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const drag = dragRef.current;
      if (!drag) {
        updateCursor(px, py);
        return;
      }
      // No button pressed means a pointer-up was missed — abandon the drag.
      if (e.buttons === 0) {
        if (canvas.hasPointerCapture(e.pointerId)) {
          canvas.releasePointerCapture(e.pointerId);
        }
        dragRef.current = null;
        setOverTrash(false);
        canvas.style.cursor = "default";
        return;
      }
      if (drag.mode.type === "move") {
        applyMove(drag, rect, px, py);
      } else {
        applyResize(drag, drag.mode.corner, rect, px, py);
      }
    },
    [applyMove, applyResize, setOverTrash, updateCursor],
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      const drag = dragRef.current;
      if (!drag) return;
      if (canvas?.hasPointerCapture(e.pointerId)) {
        canvas.releasePointerCapture(e.pointerId);
      }
      if (drag.mode.type === "move" && overTrashRef.current) {
        onRemoveNote(drag.id);
      }
      dragRef.current = null;
      setOverTrash(false);
      if (canvas) canvas.style.cursor = "default";
    },
    [onRemoveNote, setOverTrash],
  );

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [draw]);

  return {
    canvasRef,
    trashRef,
    isOverTrash,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
