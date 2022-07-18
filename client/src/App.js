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
import Login from './authentication/Login'
import Signup from './authentication/Signup'
import Editor from './editor/Editor'
import CustomNavbar from './commonComponents/CustomNavbar'

setChonkyDefaults({ iconComponent: ChonkyIconFA })

//configure reedux store and its reducers
const store = configureStore({
  reducer: allReducers
})

function App() {
  return (
    <div>
      <Provider store={store}>
        <ToastContainer />
        <BrowserRouter>
        <CustomNavbar />
          <Routes>
              <Route path='/' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/home' element={<Home />} />
              <Route path='/editor' element={<Editor />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  )
}

export default App
