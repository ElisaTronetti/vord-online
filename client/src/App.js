import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { setChonkyDefaults } from 'chonky'
import { ChonkyIconFA } from 'chonky-icon-fontawesome'
import 'bootstrap/dist/css/bootstrap.min.css'

import Home from './home/Home'
import Login from './login/Login'

setChonkyDefaults({ iconComponent: ChonkyIconFA })

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
