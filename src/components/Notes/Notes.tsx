import Layout from '../Layout'
import Canvas from './Canvas'
import Sidebar from './Sidebar'

function Notes() {
  return <Layout left={<Canvas />} right={<Sidebar />} />
}

export default Notes
