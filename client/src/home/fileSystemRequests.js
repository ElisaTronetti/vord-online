import $ from 'jquery'
import { createErrorToast } from '../commonComponents/Toast'
import { setRootFolderId, setFileMap } from '../redux/fileSystemData/actions'

export function getFileSystem(id, token, dispatch) {
    $.ajax({
        contentType: 'application/json',
        headers: { "token": token },
        dataType: 'json',
        success: function (result) {
            let id = result.rootFolderId
            dispatch(setRootFolderId(id))
            let fileMap = result.fileMap
            dispatch(setFileMap(fileMap))
        },
        error: function () {
            console.log('error')
        },
        processData: false,
        type: 'GET',
        url: process.env.REACT_APP_SERVER + "fileSystem/getUserFileSystem?_id=" + id
    })
}

export function updateFileSystem(id, token, fileSystem) {
    $.ajax({
        contentType: 'application/json',
        headers: { 'token': token },
        dataType: 'json',
        data: createFileSystemParams(id, fileSystem),
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

export function createNewDocument(id, token, documentId, title) {
    $.ajax({
        contentType: 'application/json',
        headers: { 'token': token },
        dataType: 'json',
        data: createDocumentParams(id, documentId, title),
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

export function deleteDocument(id, token, documentId) {

    $.ajax({
        contentType: 'application/json',
        headers: { 'token': token },
        dataType: 'json',
        data: createDeleteDocumentParams(id, documentId),
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