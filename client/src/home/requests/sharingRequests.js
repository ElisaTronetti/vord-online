import $ from 'jquery'
import { createErrorToast, createSuccessToast } from "../../commonComponents/Toast"
import { getFileSystem } from './fileSystemRequests'

export function shareDocument(user, inputFields, document, props, resetInputFields, dispatch) {
    console.log(inputFields)
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

export function getSharedGroup(documentId, userId, setSharedGroupData) {
    $.ajax({
        contentType: 'application/json',
        headers: { 'userid': userId, 'documentid': documentId },
        success: function (res) {
            let userInfo = res.filter(entry => entry._id === userId)
            let sharedGroup = res.filter(entry => entry._id !== userId)
            setSharedGroupData({
                user: userInfo,
                sharedGroup: sharedGroup
            })
        },
        error: function () {
            createErrorToast('Error: impossible to retrieve the shared group')
        },
        type: 'GET',
        url: process.env.REACT_APP_SERVER + 'sharedDocuments/getSharedGroup'
    })
}

export function manageSharedGroup(user, sharedGroup, document, props, resetInputFields, dispatch) {
    console.log(sharedGroup)
    $.ajax({
        contentType: 'application/json',
        headers: { 'token': user.token },
        dataType: 'json',
        data: createShareDocumentParams(user, sharedGroup, document.id),
        success: function () {
            createSuccessToast('Shared group modified')
            props.onHide()
            resetInputFields()
            getFileSystem(user, dispatch)
        },
        error: function () {
            createErrorToast('Error: impossible modify the shared group')
        },
        type: 'POST',
        url: process.env.REACT_APP_SERVER + 'sharedDocuments/manageSharedGroup'
    })
}