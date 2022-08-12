import $ from 'jquery'
import { setRootFolderId, setFileMap } from '../../redux/fileSystemData/actions'
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
            createErrorToast('Error while deleting ' + document.name)
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

export function createNewDocument(user, documentTitle, dispatch) {
    $.ajax({
        contentType: 'application/json',
        headers: { 'token': user.token },
        dataType: 'json',
        data: createDocumentParams(user.id, documentTitle),
        success: function (result) {
            // Save new file system state
            let id = result.fileSystem.rootFolderId
            dispatch(setRootFolderId(id))
            let fileMap = result.fileSystem.fileMap
            dispatch(setFileMap(fileMap))
            createSuccessToast('Document ' + documentTitle + '.txt created correctly')
        },
        error: function () {
            createErrorToast('Error: impossible to create the new document ' + documentTitle + '.txt')
        },
        type: 'POST',
        url: process.env.REACT_APP_SERVER + 'document/createNewDocument'
    })
}

// Create body params for create document
function createDocumentParams(id, documentTitle) {
    return JSON.stringify({
        _id: id,
        title: documentTitle,
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

export function copyDocument(user, originalDocument, dispatch) {
    $.ajax({
        contentType: 'application/json',
        headers: { 'token': user.token },
        dataType: 'json',
        data: copyDocumentParams(user.id, originalDocument),
        success: function (result) {
            // Save new file system state
            let id = result.fileSystem.rootFolderId
            dispatch(setRootFolderId(id))
            let fileMap = result.fileSystem.fileMap
            dispatch(setFileMap(fileMap))
            createSuccessToast('Local document ' + originalDocument.name + ' copied correctly')
        },
        error: function () {
            createErrorToast('Error: impossible to copy ' + originalDocument.name)
        },
        type: 'POST',
        url: process.env.REACT_APP_SERVER + 'document/createNewDocument'
    })
}

// Create body params for copy document
function copyDocumentParams(id, originalDocument) {
    return JSON.stringify({
        _id: id,
        originalDocumentId: originalDocument.id,
        title: '(Copy)' + originalDocument.name.replace('.txt', ''),
        time: new Date().getTime(),
    })
}