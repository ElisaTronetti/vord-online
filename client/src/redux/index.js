import { combineReducers } from 'redux'

import counterReducer from './counter/reducer'
import userDataReducer from './userData/reducer'

const allReducers = combineReducers({
    counter: counterReducer,
    userData: userDataReducer,
})

export default allReducers
