import $ from 'jquery'
import { createErrorToast, createSuccessToast } from "../../commonComponents/toast/Toast"
import { getFileSystem } from './fileSystemRequests'
import { notifyShareDocument } from '../../util/socketCommunication'

export function shareDocument(user, inputFields, document, props, resetInputFields, dispatch, socket) {
    $.ajax({
        contentType: 'application/json',
        headers: { 'token': user.token },
        dataType: 'json',
        data: createShareDocumentParams(user, inputFields, document.id),
        success: function () {
            createSuccessToast('Document ' + document.name + ' shared correctly')
            notifyShareDocument(socket, user.id, document.id, inputFields)
            props.onHide()
            resetInputFields()
            getFileSystem(user, dispatch)
        },
        error: function () {
            //TODO check if unauthorized and create a different error message
            createErrorToast('Error: impossible to share the document ' + document.name)
        },
        type: 'POST',
        url: process.env.REACT_APP_SERVER + (document.isShared ? '/sharedDocuments/shareSharedDocument' : '/sharedDocuments/shareLocalDocument')
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

export function getSharedGroup(documentId, userId, token, setSharedGroupData) {
    $.ajax({
        contentType: 'application/json',
        headers: { 'token': token, 'userid': userId, 'documentid': documentId },
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
        url: process.env.REACT_APP_SERVER + '/sharedDocuments/getSharedGroup'
    })
}

export function manageSharedGroup(user, alreadyPresentSharedGroup, addedToSharedGroup, document, props, resetInputFields, dispatch, socket) {
    $.ajax({
        contentType: 'application/json',
        headers: { 'token': user.token },
        dataType: 'json',
        data: createShareDocumentParams(user, alreadyPresentSharedGroup.concat(addedToSharedGroup), document.id),
        success: function () {
            createSuccessToast('Shared group modified for ' + document.name)
            notifyShareDocument(socket, user.id, document.id, addedToSharedGroup)
            props.onHide()
            resetInputFields()
            getFileSystem(user, dispatch)
        },
        error: function () {
            createErrorToast('Error: impossible modify the shared group for ' + document.name)
        },
        type: 'POST',
        url: process.env.REACT_APP_SERVER + '/sharedDocuments/manageSharedGroup'
    })
}