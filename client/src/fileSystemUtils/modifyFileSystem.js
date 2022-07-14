import { setFileMap } from '../redux/fileSystemData/actions'
import { __assign, __spreadArray } from './dataStructureUtils'
import ObjectID  from 'bson-objectid'

import { createSuccessToast } from '../toast/createToast'

export const deleteFiles = (fileMap, files, dispatch) => {
    // Create a copy of fileMap
    const newFileMap = { ...fileMap }
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
        }
        // Update the fileMap in redux
        dispatch(setFileMap(newFileMap))
        createSuccessToast('Element deleted correctly')
    })
}

export const moveFiles = (fileMap, files, source, destination, dispatch) => {
    // Create a copy of fileMap
    const newFileMap = { ...fileMap }
    const moveFileIds = new Set(files.map((f) => f.id))
    // Delete files from their source folder
    var newSourceChildrenIds = source.childrenIds.filter(function (id) { return !moveFileIds.has(id) })
    newFileMap[source.id] = __assign(__assign({}, source), { childrenIds: newSourceChildrenIds, childrenCount: newSourceChildrenIds.length })
    // Add the files to their destination folder
    var newDestinationChildrenIds = __spreadArray(__spreadArray([], destination.childrenIds, true), files.map(function (f) { return f.id }), true)
    newFileMap[destination.id] = __assign(__assign({}, destination), { childrenIds: newDestinationChildrenIds, childrenCount: newDestinationChildrenIds.length })
    // Update the parent folder ID on the files from source folder ID to the destination folder ID.
    files.forEach(function (file) {
        newFileMap[file.id] = __assign(__assign({}, file), { parentId: destination.id })
    })
    // Update the fileMap in redux
    dispatch(setFileMap(newFileMap))
    createSuccessToast('Element moved correctly')
}

export const createFolder = (fileMap, currentFolderId, folderName, dispatch) => {
    // Create a copy of fileMap
    const newFileMap = { ...fileMap }
    // Create the new folder
    let folderId = ObjectID().toHexString()
    newFileMap[folderId] = {
        id: folderId,
        name: folderName,
        isDir: true,
        parentId: currentFolderId,
        childrenIds: [],
        childrenCount: 0,
    }
    // Update parent folder to reference the new folder
    var parent = newFileMap[currentFolderId]
    newFileMap[currentFolderId] = __assign(__assign({}, parent), { childrenIds: __spreadArray(__spreadArray([], parent.childrenIds, true), [folderId], false) })
    // Update fileMap
    dispatch(setFileMap(newFileMap))
    createSuccessToast('Folder ' + folderName + ' created correctly')
}

export const createDocument = (fileMap, currentFolderId, documentId, documentName, dispatch) => {
    // Create a copy of fileMap
    const newFileMap = { ...fileMap }
    // Create the new folder
    newFileMap[documentId] = {
        id: documentId,
        name: documentName,
        parentId: currentFolderId,
        ext: '.txt',
    }
    // Update parent folder to reference the new folder
    var parent = newFileMap[currentFolderId]
    newFileMap[currentFolderId] = __assign(__assign({}, parent), { childrenIds: __spreadArray(__spreadArray([], parent.childrenIds, true), [documentId], false) })
    // Update fileMap
    dispatch(setFileMap(newFileMap))
    createSuccessToast('Document ' + documentName + ' created correctly')
}
