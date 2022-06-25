import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import Home from './home/Home'
import Login from './login/Login'

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

export default App;
