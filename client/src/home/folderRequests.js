import $ from 'jquery'
import { setRootFolderId, setFileMap } from '../redux/fileSystemData/actions'
import { createErrorToast, createSuccessToast } from '../commonComponents/Toast'

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