import { combineReducers } from 'redux'

import counterReducer from './counter/reducer'

const allReducers = combineReducers({
    counter: counterReducer,
})

export default allReducers
