import $ from 'jquery'
import { createErrorToast } from '../commonComponents/toast/Toast'

export function getDocument(documentId, userId, token, setEditorData) {
    $.ajax({
        contentType: 'application/json',
        headers: { 'token': token },
        success: function (res) {
            setEditorData(res)
        },
        error: function (err) {
            console.log(err)
            createErrorToast('Error: impossible to retrieve the document')
        },
        type: 'GET',
        url: process.env.REACT_APP_SERVER + '/document/getDocument?_id='+documentId+'&userId='+userId
    })
}

export function saveDocument(userId, token, documentId, blocks) {
    $.ajax({
        contentType: 'application/json',
        headers: { 'token': token },
        data: createDocumentParams(userId, documentId, token, blocks),
        error: function () {
            createErrorToast('Error: impossible to save the document')
        },
        type: 'POST',
        url: process.env.REACT_APP_SERVER + '/document/saveDocument'
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