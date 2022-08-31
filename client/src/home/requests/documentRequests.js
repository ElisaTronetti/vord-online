import $ from 'jquery'
import { createErrorToast, createSuccessToast } from '../../commonComponents/Toast'
import { updateFileSystem } from './requestsUtil'

export function deleteSharedDocument(user, document, deleteForMe, dispatch) {
    $.ajax({
        contentType: 'application/json',
        headers: { 'token': user.token },
        dataType: 'json',
        data: createDeleteSharedDocument(user, document.id),
        success: function (result) {
            // Save new file system state
            updateFileSystem(dispatch, result)
            createSuccessToast('The shared document ' + document.name + ' has been deleted correctly')
        },
        error: function () {
            createErrorToast('Error: impossible to delete ' + document.name)
        },
        type: 'POST',
        url: process.env.REACT_APP_SERVER + '/sharedDocuments/' + ((deleteForMe) ? 'deleteForMe' : 'deleteForAll')
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

export function createNewDocument(user, parentId, documentTitle, dispatch) {
    $.ajax({
        contentType: 'application/json',
        headers: { 'token': user.token },
        dataType: 'json',
        data: createDocumentParams(user.id, documentTitle, parentId),
        success: function (result) {
            // Save new file system state
            updateFileSystem(dispatch, result)
            createSuccessToast('Document ' + documentTitle + '.txt created correctly')
        },
        error: function () {
            createErrorToast('Error: impossible to create the new document ' + documentTitle + '.txt')
        },
        type: 'POST',
        url: process.env.REACT_APP_SERVER + '/document/createNewDocument'
    })
}

// Create body params for create document
function createDocumentParams(id, documentTitle, parentId) {
    return JSON.stringify({
        _id: id,
        title: documentTitle,
        time: new Date().getTime(),
        parentId: parentId
    })
}

export function deleteLocalDocument(user, document, dispatch) {
    $.ajax({
        contentType: 'application/json',
        headers: { 'token': user.token },
        dataType: 'json',
        data: createDeleteDocumentParams(user.id, document.id),
        success: function (result) {
            // Save new file system state
            updateFileSystem(dispatch, result)
            createSuccessToast('Document ' + document.name + ' deleted correctly')
        },
        error: function () {
            createErrorToast('Error: impossible to delete ' + document.name)
        },
        type: 'POST',
        url: process.env.REACT_APP_SERVER + '/document/deleteDocument'
    })
}

// Create body params for delete local document
function createDeleteDocumentParams(userId, documentId) {
    return JSON.stringify({
        userId: userId,
        documentId: documentId,
    })
}

export function copyDocument(user, originalDocument, dispatch) {
    $.ajax({
        contentType: 'application/json',
        headers: { 'token': user.token },
        dataType: 'json',
        data: copyDocumentParams(user.id, originalDocument),
        success: function (result) {
            // Save new file system state
            updateFileSystem(dispatch, result)
            createSuccessToast('Local document ' + originalDocument.name + ' copied correctly')
        },
        error: function () {
            createErrorToast('Error: impossible to copy ' + originalDocument.name)
        },
        type: 'POST',
        url: process.env.REACT_APP_SERVER + '/document/createNewDocument'
    })
}

// Create body params for copy document
function copyDocumentParams(id, originalDocument) {
    return JSON.stringify({
        _id: id,
        originalDocumentId: originalDocument.id,
        title: '(Copy)' + originalDocument.name.replace('.txt', ''),
        time: new Date().getTime(),
        parentId: originalDocument.parentId
    })
}