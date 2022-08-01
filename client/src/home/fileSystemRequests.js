import $ from 'jquery'
import { createErrorToast } from '../commonComponents/Toast'
import { setRootFolderId, setFileMap } from '../redux/fileSystemData/actions'

export function getFileSystem(user, dispatch) {
    $.ajax({
        contentType: 'application/json',
        headers: { "token": user.token },
        dataType: 'json',
        data: createGetFileSystemParams(user.id),
        success: function (result) {
            // No need to check the similarity
            // A component will not rerender if the state is the same
            let id = result.rootFolderId
            dispatch(setRootFolderId(id))
            let fileMap = result.fileMap
            dispatch(setFileMap(fileMap))
        },
        error: function () {
            console.log('error')
        },
        type: 'GET',
        url: process.env.REACT_APP_SERVER + "fileSystem/getUserFileSystem?_id=" + user.id
    })
}

// Create body params for get file system
function createGetFileSystemParams(id) {
    return JSON.stringify({
        _id: id
    })
}

export function updateFileSystem(user, fileSystem) {
    $.ajax({
        contentType: 'application/json',
        headers: { 'token': user.token },
        dataType: 'json',
        data: createFileSystemParams(user.id, fileSystem),
        success: function () {
            console.log("Updated file system")
        },
        error: function () {
            createErrorToast('Error: impossible to update the file system')
        },
        type: 'POST',
        url: process.env.REACT_APP_SERVER + 'fileSystem/updateUserFileSystem'
    })
}

// Create body params for file system
function createFileSystemParams(id, fileSystem) {
    return JSON.stringify({
        _id: id,
        fileSystem: fileSystem
    })
}

export function createNewDocument(user, documentId, title) {
    $.ajax({
        contentType: 'application/json',
        headers: { 'token': user.token },
        dataType: 'json',
        data: createDocumentParams(user.id, documentId, title),
        success: function () {
            console.log("Created new document")
        },
        error: function () {
            createErrorToast('Error: impossible to create a new document')
        },
        type: 'POST',
        url: process.env.REACT_APP_SERVER + 'document/createNewDocument'
    })
}

// Create body params for create document
function createDocumentParams(id, documentId, title) {
    return JSON.stringify({
        _id: id,
        newDocumentId: documentId,
        title: title,
        time: new Date().getTime(),
    })
}

export function deleteDocument(user, documentId) {

    $.ajax({
        contentType: 'application/json',
        headers: { 'token': user.token },
        dataType: 'json',
        data: createDeleteDocumentParams(user.id, documentId),
        success: function () {
            console.log("Document deleted")
        },
        error: function () {
            createErrorToast('Error: impossible to delete document')
        },
        type: 'POST',
        url: process.env.REACT_APP_SERVER + 'document/deleteDocument'
    })
    console.log('Delete document')
}

// Create body params for delete document
function createDeleteDocumentParams(id, documentId) {
    return JSON.stringify({
        userId: id,
        documentId: documentId,
    })
}

export function copyDocument(user, originalDocumentId, documentId, title) {
    $.ajax({
        contentType: 'application/json',
        headers: { 'token': user.token },
        dataType: 'json',
        data: copyDocumentParams(user.id, originalDocumentId, documentId, title),
        success: function () {
            console.log("Copied document")
        },
        error: function () {
            createErrorToast('Error: impossible to copy document')
        },
        type: 'POST',
        url: process.env.REACT_APP_SERVER + 'document/createNewDocument'
    })
}

// Create body params for copy document
function copyDocumentParams(id, originalDocumentId, documentId, title) {
    return JSON.stringify({
        _id: id,
        originalDocumentId: originalDocumentId,
        newDocumentId: documentId,
        title: title,
        time: new Date().getTime(),
    })
}