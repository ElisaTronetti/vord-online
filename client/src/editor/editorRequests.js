import $ from 'jquery'
import { createErrorToast, createSuccessToast } from '../toast/createToast'

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
        url: process.env.REACT_APP_SERVER + 'fileSystem/getDocument?_id='+documentId
    })
}