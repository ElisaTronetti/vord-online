import $ from 'jquery'
import { createErrorToast, createSuccessToast } from '../../commonComponents/Toast'

export function deleteSharedDocument(user, document, deleteForMe) {
    $.ajax({
        contentType: 'application/json',
        headers: { "token": user.token },
        dataType: 'json',
        data: createDeleteSharedDocument(user, document.id),
        success: function () {
           createSuccessToast('The shared document ' + document.name + ' has been deleted correctly') 
        },
        error: function (err) {
            console.log(err)
            createErrorToast('Error while deleting ' + document.name )
        },
        type: 'POST',
        url: process.env.REACT_APP_SERVER + "sharedDocuments/" + ((deleteForMe) ? "deleteForMe" : "deleteForAll")
    })
}

// Create body params for delete shared document
function createDeleteSharedDocument(user, documentId) {
    return JSON.stringify({
        user: {
            _id: user.id,
            email: user.email
        },
        documentId: documentId
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

export function deleteLocalDocument(user, documentId) {
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