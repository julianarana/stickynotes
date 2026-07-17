import type { Note } from '../../../types/note'
import './Sticky.css'

interface StickyProps {
  note: Note
}

function Sticky({ note }: StickyProps) {
  return (
    <div
      className="sticky"
      style={{
        left: note.x,
        top: note.y,
        width: note.w,
        height: note.h,
      }}
    >
      {note.text}
    </div>
  )
}

export default Sticky
