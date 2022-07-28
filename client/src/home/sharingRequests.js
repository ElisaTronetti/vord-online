import $ from 'jquery'
import { createErrorToast, createSuccessToast } from "../commonComponents/Toast"

export function shareDocument(userId, userEmail, inputFields, documentId, isShared, props, resetInputFields) {
    $.ajax({
        contentType: 'application/json',
        dataType: 'json',
        data: createShareDocumentParams(userId, userEmail, inputFields, documentId),
        success: function () {
            createSuccessToast("Document shared correctly")
            props.onHide()
            resetInputFields()
        },
        error: function () {
            //TODO check if unauthorized and create a different error message
            createErrorToast('Error: impossible to share the document')
        },
        type: 'POST',
        url: process.env.REACT_APP_SERVER + (isShared ? '/sharedDocuments/shareSharedDocument' : 'sharedDocuments/shareLocalDocument')
    })
}

// Create body params for share document
function createShareDocumentParams(userId, userEmail, inputFields, documentId) {
    return JSON.stringify({
        user: {
            _id: userId,
            email: userEmail
        },
        sharedWith: inputFields,
        documentId: documentId
    })
}