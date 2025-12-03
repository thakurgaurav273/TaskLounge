import { useSelector } from 'react-redux'
import './App.css'
import Content from './components/Content'
import Sidebar from './components/Sidebar'

function App() {
  const currentStore = useSelector((state:any) => state.inboxNotification);

  console.log(currentStore);
  return (
    <div className='App flex'>
      <Sidebar/>
      <Content/>
    </div>
  )
}

export default App
