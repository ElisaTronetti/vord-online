import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { setChonkyDefaults } from 'chonky'
import { ChonkyIconFA } from 'chonky-icon-fontawesome'
import 'bootstrap/dist/css/bootstrap.min.css'

import userDataReducer from './redux/userData/reducer'

import Home from './home/Home'
import Login from './login/Login'
import Signup from './signup/Signup'

setChonkyDefaults({ iconComponent: ChonkyIconFA })

const store = configureStore({
  reducer: {
    // Define a top-level state field named `userData`, handled by `userDataReducer`
    userData: userDataReducer,
  }
})

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/home' element={<Home/>}/>
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
