import $ from 'jquery'
import { createErrorToast, createSuccessToast } from '../commonComponents/Toast'

export function getDocument(documentId, token, userId, setEditorData) {
    $.ajax({
        contentType: 'application/json',
        headers: { 'token': token, 'userId': userId },
        success: function (res) {
            setEditorData(res)
            createSuccessToast("Opening document")
        },
        error: function () {
            createErrorToast('Error: impossible to retrieve the document')
        },
        type: 'GET',
        url: process.env.REACT_APP_SERVER + 'document/getDocument?_id='+documentId
    })
}

export function saveDocument(userId, documentId, token, blocks) {
    $.ajax({
        contentType: 'application/json',
        data: createDocumentParams(userId, documentId, token, blocks),
        success: function (res) {
            createSuccessToast("Document saved")
        },
        error: function () {
            createErrorToast('Error: impossible to save the document')
        },
        type: 'POST',
        url: process.env.REACT_APP_SERVER + 'document/saveDocument'
    })
}

// Create body params for file system
function createDocumentParams(userId, documentId, token, blocks) {
    return JSON.stringify({
        userId: userId,
        documentId: documentId,
        token: token,
        time: new Date().getTime(),
        blocks: blocks
    })
}