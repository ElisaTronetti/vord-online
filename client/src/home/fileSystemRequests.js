import $ from 'jquery'
import { createErrorToast } from '../toast/createToast'

export function updateFileSystem(id, token, fileSystem) {
    $.ajax({
        contentType: 'application/json',
        headers: { 'token': token },
        dataType: 'json',
        data: createParams(id, fileSystem),
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

// Create body params
function createParams(id, fileSystem) {
    return JSON.stringify({
        _id: id,
        fileSystem: fileSystem
    })
}
