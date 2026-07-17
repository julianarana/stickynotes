import { useNotesStore } from '../../store/useNotesStore'
import Layout from '../Layout'
import Canvas from './Canvas'
import Sidebar from './Sidebar'

function Notes() {
  const notes = useNotesStore((state) => state.notes)

  return <Layout left={<Canvas notes={notes} />} right={<Sidebar />} />
}

export default Notes
