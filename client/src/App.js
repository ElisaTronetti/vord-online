import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { setChonkyDefaults } from 'chonky'
import { ChonkyIconFA } from 'chonky-icon-fontawesome'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { SocketContext, socket } from './util/socketContext'
import { persistor, store } from './util/store'
import { PersistGate } from 'redux-persist/integration/react'

import Home from './home/Home'
import Login from './authentication/Login'
import Signup from './authentication/Signup'
import Editor from './editor/Editor'
import CustomNavbar from './commonComponents/navbar/CustomNavbar'

setChonkyDefaults({ iconComponent: ChonkyIconFA })

function App() {
  return (
    <Provider store={store}>
      <SocketContext.Provider value={socket}>
        <PersistGate loading={null} persistor={persistor}>
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
        </PersistGate>
      </SocketContext.Provider>
    </Provider>
  )
}

export default App