import $ from 'jquery'
import { createErrorToast, createSuccessToast } from "../commonComponents/Toast"

export function shareLocalDocument(userId, userEmail, inputFields, documentId, props) {
    $.ajax({
        contentType: 'application/json',
        dataType: 'json',
        data: createShareLocalDocumentParams(userId, userEmail, inputFields, documentId),
        success: function () {
            createSuccessToast("Document shared correctly")
            props.onHide()
        },
        error: function () {
            //TODO check if unauthorized and create a different error message
            createErrorToast('Error: impossible to share the document')
        },
        type: 'POST',
        url: process.env.REACT_APP_SERVER + 'sharedDocuments/shareLocalDocument'
    })
}

// Create body params for share local document
function createShareLocalDocumentParams(userId, userEmail, inputFields, documentId) {
    return JSON.stringify({
        user: {
            _id: userId,
            email: userEmail
        },
        sharedWith: inputFields,
        documentId: documentId
    })
}