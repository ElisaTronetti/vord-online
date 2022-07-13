import $ from 'jquery'
import { setToken, setId } from "../redux/userData/actions"
import { setRootFolderId, setFileMap } from '../redux/fileSystemData/actions'
import { createSuccessToast, createErrorToast, createWarningToast } from '../toast/createToast'

export default function userLogin(email, password, dispatch) {
    if (email !== '' && password !== '') {
        $.ajax({
            contentType: 'application/json',
            dataType: 'json',
            data: createParams(email, password),
            success: function (result) {
                // Save token
                let token = result.token
                dispatch(setToken(token))
                // Save user id
                let id = result._id
                dispatch(setId(id))
                // Save file system if it exists
                if (result.fileSystem !== undefined) {
                    let fileSystem = result.fileSystem
                    dispatch(setRootFolderId(fileSystem.rootFolderId))
                    dispatch(setFileMap(fileSystem.fileMap))
                }
                createSuccessToast('Login successful!')
            },
            error: function () {
                createErrorToast('Error: enable to login')
            },
            type: 'POST',
            url: process.env.REACT_APP_SERVER + "auth/login"
        })
    } else {
        createWarningToast('Missing required data')
    }
}

// Create body params
function createParams(email, password) {
    return JSON.stringify({
        email: email,
        password: password
    })
}