import $ from 'jquery'
import { createErrorToast, createSuccessToast } from '../../commonComponents/Toast'
import { setRootFolderId, setFileMap } from '../../redux/fileSystemData/actions'

export function getFileSystem(user, dispatch) {
    $.ajax({
        contentType: 'application/json',
        headers: { "token": user.token },
        dataType: 'json',
        data: createGetFileSystemParams(user.id),
        success: function (result) {
            // No need to check the similarity
            // A component will not rerender if the state is the same
            let id = result.rootFolderId
            dispatch(setRootFolderId(id))
            let fileMap = result.fileMap
            dispatch(setFileMap(fileMap))
        },
        error: function () {
            console.log('error')
        },
        type: 'GET',
        url: process.env.REACT_APP_SERVER + "fileSystem/getUserFileSystem?_id=" + user.id
    })
}

// Create body params for get file system
function createGetFileSystemParams(id) {
    return JSON.stringify({
        _id: id
    })
}

export function updateFileSystem(user, fileSystem) {
    $.ajax({
        contentType: 'application/json',
        headers: { 'token': user.token },
        dataType: 'json',
        data: createFileSystemParams(user.id, fileSystem),
        success: function () {
            console.log("Updated file system")
        },
        error: function () {
            createErrorToast('Error: impossible to update the file system')
        },
        type: 'POST',
        url: process.env.REACT_APP_SERVER + 'fileSystem/updateUserFileSystem'
    })
}

// Create body params for file system
function createFileSystemParams(id, fileSystem) {
    return JSON.stringify({
        _id: id,
        fileSystem: fileSystem
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
            console.log(result)
            // Save new file system state
            let id = result.fileSystem.rootFolderId
            dispatch(setRootFolderId(id))
            let fileMap = result.fileSystem.fileMap
            dispatch(setFileMap(fileMap))
            createSuccessToast('The elements ' + names + ' moved correctly in ' + destination.name)
        },
        error: function () {
            createErrorToast('Error: move the elements ' + names + ' in ' + destination.name)
        },
        type: 'POST',
        url: process.env.REACT_APP_SERVER + 'fileSystem/moveElements'
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