import $ from 'jquery'
import { setRootFolderId, setFileMap } from '../../redux/fileSystemData/actions'
import { createErrorToast, createSuccessToast } from '../../commonComponents/Toast'

export function createFolder(user, parentId, folderName, dispatch) {
    $.ajax({
        contentType: 'application/json',
        headers: { 'token': user.token },
        dataType: 'json',
        data: createFolderParams(user.id, parentId, folderName),
        success: function (result) {
            // Save new file system state
            let id = result.fileSystem.rootFolderId
            dispatch(setRootFolderId(id))
            let fileMap = result.fileSystem.fileMap
            dispatch(setFileMap(fileMap))
            createSuccessToast('Folder ' + folderName + ' created correctly')
        },
        error: function () {
            createErrorToast('Error: impossible to create the folder ' + folderName)
        },
        type: 'POST',
        url: process.env.REACT_APP_SERVER + 'fileSystem/createFolder'
    })
}

// Create body params for folder creation
function createFolderParams(userId, parentId, folderName) {
    return JSON.stringify({
        userId: userId,
        parentId: parentId,
        name: folderName.trim()
    })
}

export function deleteFolder(user, folder, dispatch) {
    $.ajax({
        contentType: 'application/json',
        headers: { "token": user.token },
        dataType: 'json',
        data: createDeleteFolderParam(user.id, folder.id),
        success: function (result) {
            // Save new file system state
            let id = result.fileSystem.rootFolderId
            dispatch(setRootFolderId(id))
            let fileMap = result.fileSystem.fileMap
            dispatch(setFileMap(fileMap))
            createSuccessToast('The folder ' + folder.name + ' has been deleted correctly')
        },
        error: function (err) {
            createErrorToast('Error while deleting ' + folder.name)
        },
        type: 'POST',
        url: process.env.REACT_APP_SERVER + 'fileSystem/deleteFolder'
    })
}

// Create body params for delete folder
function createDeleteFolderParam(userId, folderId) {
    return JSON.stringify({
        userId: userId,
        folderId: folderId
    })
}