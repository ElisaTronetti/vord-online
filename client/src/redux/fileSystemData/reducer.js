import { emptyFileSystemJson } from '../../home/fileSystemUtils/fileSystemStructure'

var initialState = {
    rootFolderId: emptyFileSystemJson.rootFolderId,
    fileMap: emptyFileSystemJson.fileMap
}

const fileSystemReducer = (state = initialState, action) => {
    switch(action.type){
        case 'SET_ROOT_FOLDER_ID': return Object.assign({}, state, {
            rootFolderId: action.payload
        })
        case 'SET_FILE_MAP': return Object.assign({}, state, {
            fileMap: action.payload
        })
        case 'RESET_FILE_SYSTEM': return initialState
        default: return state
    }
}

export default fileSystemReducer