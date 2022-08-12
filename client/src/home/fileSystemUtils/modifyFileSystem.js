import { setFileMap } from '../../redux/fileSystemData/actions'
import { recreateFileSystem } from './fileSystemStructure'
import { updateFileSystem } from '../fileSystemRequests'

import { createSuccessToast } from '../../commonComponents/Toast'

export const deleteFiles = (user, fileSystem, files, dispatch) => {
    // Create a copy of fileMap
    const newFileMap = { ...fileSystem.fileMap }
    files.forEach((file) => {
        // Delete file from the file map
        delete newFileMap[file.id]
        // Update the parent folder to make sure it does not try to load the file just deleted
        if (file.parentId && newFileMap[file.parentId] !== null) {
            const parent = newFileMap[file.parentId]
            var newChildrenIds = parent.childrenIds.filter(function (id) { return id !== file.id })
            newFileMap[file.parentId] = {
                ...parent,
                childrenIds: newChildrenIds,
                childrenCount: newChildrenIds.length,
            }
            createSuccessToast(file.name + ' deleted correctly')
        }
    })
    // Update the fileMap in redux
    dispatch(setFileMap(newFileMap))
    update(user, fileSystem.rootFolderId, newFileMap)
    const updatedFileSystem = {
        rootFolderId: fileSystem.rootFolderId,
        fileMap: newFileMap
    }
    return updatedFileSystem
}

function update(user, rootFolderId, fileMap) {
    let fileSystem = recreateFileSystem(rootFolderId, fileMap)
    // Calling HTTP request
    updateFileSystem(user, fileSystem)
}