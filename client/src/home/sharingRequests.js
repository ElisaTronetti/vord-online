import $ from 'jquery'
import { createErrorToast, createSuccessToast } from "../commonComponents/Toast"

export function shareLocalDocument(userId, userEmail, sharingEmail, sharingRole, documentId) {
    $.ajax({
        contentType: 'application/json',
        dataType: 'json',
        data: createShareLocalDocumentParams(userId, userEmail, sharingEmail, sharingRole, documentId),
        success: function () {
            createSuccessToast("Document shared correctly")
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
function createShareLocalDocumentParams(userId, userEmail, sharingEmail, sharingRole, documentId) {
    return JSON.stringify({
        user: {
            _id: userId,
            email: userEmail
        },
        sharedWith: [{
            email: sharingEmail,
            role: sharingRole
        }],
        documentId: documentId
    })
}