import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { setChonkyDefaults } from 'chonky'
import { ChonkyIconFA } from 'chonky-icon-fontawesome'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import allReducers from './redux'
import Home from './home/Home'
import Login from './login/Login'
import Signup from './signup/Signup'
import MyEditor from './editor/EditorPage'

setChonkyDefaults({ iconComponent: ChonkyIconFA })

//configure reedux store and its reducers
const store = configureStore({
  reducer: allReducers
})

function App() {
  return (
    <Provider store={store}>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MyEditor/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/home' element={<Home/>}/>
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
