export interface Note {
  id: string; // THis unique identifier is  used to identify each note in the store - it uses internal zustand crypto UUID generator.
  text: string;
  x: number; // Horizontal position of the note in pixels.
  y: number; // Vertical position of the note in pixels.
  w: number; // Width of the note in pixels.
  h: number; // Height of the note in pixels.
}
