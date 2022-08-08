import $ from 'jquery'
import { createErrorToast, createSuccessToast } from '../commonComponents/Toast'

export function deleteSharedDocument(user, document, deleteForMe) {
    $.ajax({
        contentType: 'application/json',
        headers: { "token": user.token },
        dataType: 'json',
        data: createDeleteSharedDocument(user, document.id),
        success: function () {
           createSuccessToast('The shared document ' + document.name + ' has been deleted correctly') 
        },
        error: function () {
            createErrorToast('Error while deleting ' + document.name )
        },
        type: 'POST',
        url: process.env.REACT_APP_SERVER + "sharedDocuments/" + ((deleteForMe) ? "deleteForMe" : "deleteForAll")
    })
}

// Create body params for delete file system
function createDeleteSharedDocument(user, documentId) {
    return JSON.stringify({
        user: {
            _id: user.id,
            email: user.email
        },
        documentId: documentId
    })
}
