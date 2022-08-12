import $ from 'jquery'
import { createErrorToast, createSuccessToast } from "../../commonComponents/Toast"
import { getFileSystem } from './fileSystemRequests'

export function shareDocument(user, inputFields, document, props, resetInputFields, dispatch) {
    $.ajax({
        contentType: 'application/json',
        headers: { "token": user.token },
        dataType: 'json',
        data: createShareDocumentParams(user, inputFields, document.id),
        success: function () {
            createSuccessToast("Document shared correctly")
            props.onHide()
            resetInputFields()
            getFileSystem(user, dispatch)
        },
        error: function () {
            //TODO check if unauthorized and create a different error message
            createErrorToast('Error: impossible to share the document')
        },
        type: 'POST',
        url: process.env.REACT_APP_SERVER + (document.isShared ? 'sharedDocuments/shareSharedDocument' : 'sharedDocuments/shareLocalDocument')
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

export function getSharedGroup(documentId, userId, setInputFields) {
    console.log(documentId)
    console.log(userId)
    $.ajax({
        contentType: 'application/json',
        headers: { 'userid': userId, 'documentid': documentId },
        success: function (res) {
            setInputFields(res)
        },
        error: function () {
            createErrorToast('Error: impossible to retrieve the shared group')
        },
        type: 'GET',
        url: process.env.REACT_APP_SERVER + 'sharedDocuments/getSharedGroup'
    })
}