import { setFileMap } from '../../redux/fileSystemData/actions'
import { __assign, __spreadArray } from './dataStructureUtils'
import ObjectID from 'bson-objectid'
import { recreateFileSystem } from './fileSystemStructure'
import { updateFileSystem } from '../fileSystemRequests'
import { copyDocument } from '../documentsUtils/documentRequests'

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

export const copyDocuments = (user, fileSystem, files, dispatch) => {
    // Create a copy of fileMap
    const newFileMap = { ...fileSystem.fileMap }
    files.forEach((file) => {
        // Document name
        let name = '(Copy)' + file.name
        // Create the new document
        let documentId = ObjectID().toHexString()
        newFileMap[documentId] = {
            id: documentId,
            name: name,
            parentId: file.parentId,
            ext: '.txt',
            isShared: false
        }
        // Update parent folder to reference the new folder
        var parent = newFileMap[file.parentId]
        var newDestinationChildrenIds = __spreadArray(__spreadArray([], parent.childrenIds, true), [documentId], false)
        newFileMap[parent.id] = __assign(__assign({}, parent), { childrenIds: newDestinationChildrenIds, childrenCount: newDestinationChildrenIds.length })
        // Create document copy
        copyDocument(user, file.id, documentId, name)
        createSuccessToast('Document ' + name + ' copied correctly')
    })
    // Update fileMap
    dispatch(setFileMap(newFileMap))
    update(user, fileSystem.rootFolderId, newFileMap)
}

function update(user, rootFolderId, fileMap) {
    let fileSystem = recreateFileSystem(rootFolderId, fileMap)
    // Calling HTTP request
    updateFileSystem(user, fileSystem)
}