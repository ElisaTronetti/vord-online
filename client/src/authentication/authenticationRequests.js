import $ from 'jquery'
import { setToken, setId, setEmail } from '../redux/userData/actions'
import { setRootFolderId, setFileMap } from '../redux/fileSystemData/actions'
import { createSuccessToast, createErrorToast, createWarningToast } from '../commonComponents/Toast'

export function userLogin(email, password, dispatch) {
    if (email !== '' && password !== '') {
        $.ajax({
            contentType: 'application/json',
            dataType: 'json',
            data: createLoginParams(email, password),
            success: function (result) {
                // Save token
                let token = result.token
                dispatch(setToken(token))
                // Save user id
                let id = result._id
                dispatch(setId(id))
                // Save email
                let email = result.email
                dispatch(setEmail(email))
                // Save file system if it exists
                if (result.fileSystem !== undefined) {
                    let fileSystem = result.fileSystem
                    dispatch(setRootFolderId(fileSystem.rootFolderId))
                    dispatch(setFileMap(fileSystem.fileMap))
                }
                createSuccessToast('Login successful!')
            },
            error: function () {
                createErrorToast('Error: unable to login')
            },
            type: 'POST',
            url: process.env.REACT_APP_SERVER + 'auth/login'
        })
    } else {
        createWarningToast('Missing required data')
    }
}

// Create login body params
function createLoginParams(email, password) {
    return JSON.stringify({
        email: email.trim(),
        password: password
    })
}

export function userSignup(name, surname, email, password, passwordConfirm, dispatch) {
    if (emptySignupParams(name, surname, email, password, passwordConfirm)) {
        createWarningToast('Missing required data')
    } else if (password.trim() !== passwordConfirm.trim()) {
        createWarningToast('Passwords do not match')
    } else {
        $.ajax({
            contentType: 'application/json',
            dataType: 'json',
            data: createSignupParams(name, surname, email, password),
            success: function (result) {
                // Save token
                let token = result.token
                dispatch(setToken(token))
                // Save user id
                let id = result._id
                dispatch(setId(id))
                // Save email
                let email = result.email
                dispatch(setEmail(email))
                createSuccessToast('Signup successful!')
            },
            error: function () {
                createErrorToast('Error: unable to signup')
            },
            type: 'POST',
            url: process.env.REACT_APP_SERVER + 'auth/signup'
        })
    }
}

// Checks if there are empty params
function emptySignupParams(name, surname, email, password, passwordConfirm) {
    return name === '' &&
        surname === '' &&
        email === '' &&
        password === '' &&
        passwordConfirm === ''
}

// Create signup body params
function createSignupParams(name, surname, email, password) {
    return JSON.stringify({
        name: name.trim(),
        surname: surname.trim(),
        email: email.trim(),
        password: password
    })
}