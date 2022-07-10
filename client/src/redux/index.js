import { combineReducers } from 'redux'

import userDataReducer from './userData/reducer'

const allReducers = combineReducers({
    userData: userDataReducer,
})

export default allReducers