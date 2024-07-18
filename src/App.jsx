import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './path/Home'
import Error from './path/Error'

function App() {

  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/error' element={<Error />} />
          <Route path='*' element={<Navigate to='/error' />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
