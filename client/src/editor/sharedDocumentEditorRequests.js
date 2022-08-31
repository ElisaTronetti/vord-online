import $ from 'jquery'
import { createErrorToast } from '../commonComponents/toast/Toast'

export function getSharedDocument(documentId, userId, token, setEditorData) {
    $.ajax({
        contentType: 'application/json',
        headers: { 'token': token, 'userid': userId, 'documentid': documentId },
        success: function (res) {
            setEditorData(res)
        },
        error: function () {
            createErrorToast('Error: impossible to retrieve the document')
        },
        type: 'GET',
        url: process.env.REACT_APP_SERVER + '/sharedDocuments/getSharedDocument'
    })
}

export function saveSharedDocument(userId, token, documentId, blocks) {
    $.ajax({
        contentType: 'application/json',
        headers: { 'token': token },
        data: createDocumentParams(userId, documentId, blocks),
        error: function () {
            createErrorToast('Error: impossible to save the document')
        },
        type: 'POST',
        url: process.env.REACT_APP_SERVER + '/sharedDocuments/saveSharedDocument'
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