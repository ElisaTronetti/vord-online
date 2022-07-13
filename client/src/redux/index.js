import { combineReducers } from 'redux'

import fileSystemReducer from './fileSystemData/reducer'
import userDataReducer from './userData/reducer'

const allReducers = combineReducers({
    fileSystemData: fileSystemReducer,
    userData: userDataReducer,
})

export default allReducers