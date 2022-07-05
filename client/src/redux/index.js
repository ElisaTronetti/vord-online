import { combineReducers } from 'redux'

import fileSystemReducer from './fileSystem/reducer'
import userDataReducer from './userData/reducer'

const allReducers = combineReducers({
    userData: userDataReducer,
    fileSystemData: fileSystemReducer
})

export default allReducers