import $ from 'jquery'
import { createErrorToast, createSuccessToast } from '../commonComponents/Toast'

export function getSharedDocument(documentId, user, setEditorData) {
    $.ajax({
        contentType: 'application/json',
        headers: { 'userid': user.id, 'documentid': documentId },
        success: function (res) {
            setEditorData(res)
            createSuccessToast("Opening document")
        },
        error: function () {
            createErrorToast('Error: impossible to retrieve the document')
        },
        type: 'GET',
        url: process.env.REACT_APP_SERVER + 'sharedDocuments/getSharedDocument'
    })
}

export function saveSharedDocument(userId, documentId, blocks) {
    $.ajax({
        contentType: 'application/json',
        data: createDocumentParams(userId, documentId, blocks),
        success: function () {
            createSuccessToast("Document saved")
        },
        error: function () {
            createErrorToast('Error: impossible to save the document')
        },
        type: 'POST',
        url: process.env.REACT_APP_SERVER + 'sharedDocuments/saveSharedDocument'
    })
}

// Create body params for file system
function createDocumentParams(userId, documentId, blocks) {
    return JSON.stringify({
        user: {
            _id: userId
        },
        documentId: documentId,
        time: new Date().getTime(),
        blocks: blocks
    })
}