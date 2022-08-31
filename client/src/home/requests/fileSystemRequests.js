import $ from 'jquery'
import { createErrorToast, createSuccessToast } from '../../commonComponents/toast/Toast'
import { updateFileSystem } from './requestsUtil'

export function getFileSystem(user, dispatch) {
    $.ajax({
        contentType: 'application/json',
        headers: { 'token': user.token },
        dataType: 'json',
        success: function (result) {
            // No need to check the similarity: a component will not rerender if the state is the same
            updateFileSystem(dispatch, result)
        },
        error: function () {
            console.log('Error: impossible to get the user file system')
        },
        type: 'GET',
        url: process.env.REACT_APP_SERVER + '/fileSystem/getUserFileSystem?_id=' + user.id
    })
}

export function moveElements(user, elements, destination, dispatch) {
    const ids = elements.map(e => e.id)
    const names = elements.map(e => e.name)
    $.ajax({
        contentType: 'application/json',
        headers: { 'token': user.token },
        dataType: 'json',
        data: createMoveElementsParams(user.id, ids, destination.id),
        success: function (result) {
            // Save new file system state
            updateFileSystem(dispatch, result)
            createSuccessToast('The elements ' + names + ' moved correctly in ' + destination.name)
        },
        error: function () {
            createErrorToast('Error: impossible to move the elements ' + names + ' in ' + destination.name)
        },
        type: 'POST',
        url: process.env.REACT_APP_SERVER + '/fileSystem/moveElements'
    })
}

// Create body params for move elements
function createMoveElementsParams(userId, ids, destinationId) {
    return JSON.stringify({
        userId: userId,
        elementIds: ids,
        destinationId: destinationId
    })
}

export function renameElement(user, element, newName, dispatch, props) {
    $.ajax({
        contentType: 'application/json',
        headers: { 'token': user.token },
        dataType: 'json',
        data: createRenameElementParams(user.id, element.id, newName),
        success: function (result) {
            // Save new file system state
            updateFileSystem(dispatch, result)
            createSuccessToast('The element ' + element.name + ' renamed correctly in ' + newName)
            props.onHide()
        },
        error: function () {
            createErrorToast('Error: impossible to rename ' + element.name + ' in ' + newName)
        },
        type: 'POST',
        url: process.env.REACT_APP_SERVER + '/fileSystem/renameElement'
    })
}

// Create body params for rename element
function createRenameElementParams(userId, elementId, newName) {
    return JSON.stringify({
        userId: userId,
        newName: newName,
        elemId: elementId
    })
}