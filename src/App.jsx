import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './path/Home'
import Error from './path/Error'
import CreatePost from './path/CreatePost'
import Saved from './path/Saved'
import { useState } from 'react'

function App() {
  const [data , setData] = useState([])
  const [initial, setInitial] = useState([])

  return (
    <div>
      <Router>
        <Navbar data={data} setData={setData} initial={initial} />
        <Routes>
          <Route path='/' element={<Home data={data} setData={setData} setInitial={setInitial} />} />
          <Route path='/createpost' element={<CreatePost />} />
          <Route path='/myfavourite' element={<Saved />} />
          <Route path='/error' element={<Error />} />
          <Route path='*' element={<Navigate to='/error' />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
