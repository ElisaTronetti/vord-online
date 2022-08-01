import { setFileMap } from '../../redux/fileSystemData/actions'
import { __assign, __spreadArray } from './dataStructureUtils'
import ObjectID from 'bson-objectid'
import { FileHelper } from 'chonky'
import { recreateFileSystem } from './fileSystemStructure'
import { updateFileSystem, deleteDocument, copyDocument } from '../fileSystemRequests'

import { createSuccessToast } from '../../commonComponents/Toast'

export const deleteFiles = (id, token, rootFolderId, fileMap, files, dispatch) => {
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
            createSuccessToast(file.name + ' deleted correctly')
        }
        // Update the fileMap in redux
        dispatch(setFileMap(newFileMap))
        update(id, token, rootFolderId, newFileMap)
    })
}

export const deleteDocuments = (id, token, files) => {
    files.forEach((file) => {
        // Check if document
        if (!FileHelper.isDirectory(file)) {
            // Delete document from user
            deleteDocument(id, token, file.id)
        }
    })
}

export const moveFiles = (id, token, rootFolderId, fileMap, files, source, destination, dispatch) => {
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
    update(id, token, rootFolderId, newFileMap)
    createSuccessToast('File moved correctly')
}

export const createFolder = (id, token, rootFoldeId, fileMap, currentFolderId, folderName, dispatch) => {
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
    var newDestinationChildrenIds = __spreadArray(__spreadArray([], parent.childrenIds, true), [folderId], false)
    newFileMap[parent.id] = __assign(__assign({}, parent), { childrenIds: newDestinationChildrenIds, childrenCount: newDestinationChildrenIds.length })
    // Update fileMap
    dispatch(setFileMap(newFileMap))
    update(id, token, rootFoldeId, newFileMap)
    createSuccessToast('Folder ' + folderName + ' created correctly')
}

export const createDocument = (id, token, rootFolderId, fileMap, currentFolderId, documentId, documentName, dispatch) => {
    // Create a copy of fileMap
    const newFileMap = { ...fileMap }
    // Create the new document
    newFileMap[documentId] = {
        id: documentId,
        name: documentName + '.txt',
        parentId: currentFolderId,
        ext: '.txt',
        isShared: false
    }
    // Update parent folder to reference the new folder
    var parent = newFileMap[currentFolderId]
    var newDestinationChildrenIds = __spreadArray(__spreadArray([], parent.childrenIds, true), [documentId], false)
    newFileMap[parent.id] = __assign(__assign({}, parent), { childrenIds: newDestinationChildrenIds, childrenCount: newDestinationChildrenIds.length })
    // Update fileMap
    dispatch(setFileMap(newFileMap))
    update(id, token, rootFolderId, newFileMap)
    createSuccessToast('Document ' + documentName + ' created correctly')
}

export const copyDocuments = (id, token, rootFolderId, fileMap, files, dispatch) => {
    // Create a copy of fileMap
    const newFileMap = { ...fileMap }
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
        copyDocument(id, token, file.id, documentId, name)
        createSuccessToast('Document ' + name + ' copied correctly')
    })
    // Update fileMap
    dispatch(setFileMap(newFileMap))
    update(id, token, rootFolderId, fileMap)
}

function update(id, token, rootFolderId, fileMap){
    let fileSystem = recreateFileSystem(rootFolderId, fileMap)
    // Calling HTTP request
    updateFileSystem(id, token, fileSystem)
}