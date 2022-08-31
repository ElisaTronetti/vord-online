import $ from 'jquery'
import { setToken, setId, setEmail } from '../redux/userData/actions'
import { setRootFolderId, setFileMap } from '../redux/fileSystemData/actions'
import { createSuccessToast, createErrorToast, createNotificationToast } from '../commonComponents/Toast'
import { registerUser } from '../util/socketCommunication'

export function userLogin(email, password, dispatch, socket) {
    $.ajax({
        contentType: 'application/json',
        dataType: 'json',
        data: createLoginParams(email, password),
        success: function (result) {
            // Save data in redux store
            saveData(result.token, result._id, result.email, result.fileSystem, dispatch, socket)
            createNotificationToast('Login successful!')
        },
        error: function () {
            createErrorToast('Error: unable to login')
        },
        type: 'POST',
        url: process.env.REACT_APP_SERVER + '/auth/login'
    })
}

// Create login body params
function createLoginParams(email, password) {
    return JSON.stringify({
        email: email.trim(),
        password: password
    })
}

export function userSignup(name, surname, email, password, dispatch, socket) {
    $.ajax({
        contentType: 'application/json',
        dataType: 'json',
        data: createSignupParams(name, surname, email, password),
        success: function (result) {
            // Save data in redux store
            saveData(result.token, result._id, result.email, result.fileSystem, dispatch, socket)
            createSuccessToast('Signup successful!')
        },
        error: function () {
            createErrorToast('Error: unable to signup')
        },
        type: 'POST',
        url: process.env.REACT_APP_SERVER + '/auth/signup'
    })
}

// Create signup body params
function createSignupParams(name, surname, email, password) {
    return JSON.stringify({
        name: name.trim(),
        surname: surname.trim(),
        email: email.trim(),
        password: password,
    })
}

function saveData(token, id, email, fileSystem, dispatch, socket) {
    // Save token
    dispatch(setToken(token))
    // Save user id
    dispatch(setId(id))
    // Save email
    dispatch(setEmail(email))
    // Save file system
    dispatch(setRootFolderId(fileSystem.rootFolderId))
    dispatch(setFileMap(fileSystem.fileMap))

    // Register user in web socket
    registerUser(socket, id)
}