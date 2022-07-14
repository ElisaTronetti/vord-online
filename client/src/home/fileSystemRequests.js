import $ from 'jquery'
import { createErrorToast } from '../toast/createToast'

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
            console.log("Create new document file system")
        },
        error: function () {
            createErrorToast('Error: impossible to create a new document')
        },
        type: 'POST',
        url: process.env.REACT_APP_SERVER + 'fileSystem/createNewDocument'
    })
}

// Create body params for file system
function createDocumentParams(id, documentId, title) {
    return JSON.stringify({
        _id: id,
        newDocumentId: documentId,
        title: title,
        time: new Date().getTime(),
    })
}