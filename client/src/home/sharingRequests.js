import $ from 'jquery'
import { createErrorToast, createSuccessToast } from "../commonComponents/Toast"

export function shareDocument(user, inputFields, documentId, isShared, props, resetInputFields) {
    $.ajax({
        contentType: 'application/json',
        headers: { "token": user.token },
        dataType: 'json',
        data: createShareDocumentParams(user, inputFields, documentId),
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
        url: process.env.REACT_APP_SERVER + (isShared ? 'sharedDocuments/shareSharedDocument' : 'sharedDocuments/shareLocalDocument')
    })
}

// Create body params for share document
function createShareDocumentParams(user, inputFields, documentId) {
    return JSON.stringify({
        user: {
            _id: user.id,
            email: user.email
        },
        sharedWith: inputFields,
        documentId: documentId,
    })
}