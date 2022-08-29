import { setRootFolderId, setFileMap } from '../../redux/fileSystemData/actions'

// Save new file system state
export function updateFileSystem(dispatch, result) {
    let id = result.fileSystem.rootFolderId
    dispatch(setRootFolderId(id))
    let fileMap = result.fileSystem.fileMap
    dispatch(setFileMap(fileMap))
}