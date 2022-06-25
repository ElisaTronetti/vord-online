import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { setChonkyDefaults } from 'chonky'
import { ChonkyIconFA } from 'chonky-icon-fontawesome'
import 'bootstrap/dist/css/bootstrap.min.css'

import allReducers from './redux'

import Home from './home/Home'
import Login from './login/Login'

setChonkyDefaults({ iconComponent: ChonkyIconFA })

const store = createStore(
  allReducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/home' element={<Home/>}/>
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
