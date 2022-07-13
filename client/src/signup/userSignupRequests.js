import $ from 'jquery'
import { setToken, setId } from '../redux/userData/actions'
import { createSuccessToast, createErrorToast, createWarningToast } from '../toast/createToast'

export default function userSignup(name, surname, email, password, passwordConfirm, dispatch) {
    if (emptyParams(name, surname, email, password, passwordConfirm)) {
        createWarningToast('Missing required data')
    } else if (password.trim() !== passwordConfirm.trim()) {
        createWarningToast('Passwords do not match')
    } else {
        $.ajax({
            contentType: 'application/json',
            dataType: 'json',
            data: createParams(name, surname, email, password),
            success: function (result) {
                // Save token
                let token = result.token
                dispatch(setToken(token))
                // Save user id
                let id = result._id
                dispatch(setId(id))
                createSuccessToast('Signup successful!')
            },
            error: function () {
                createErrorToast('Error: enable to signup')
            },
            type: 'POST',
            url: process.env.REACT_APP_SERVER + "auth/signup"
        })
    }
}

// Checks if there are empty params
function emptyParams(name, surname, email, password, passwordConfirm) {
    return name === "" &&
        surname === "" &&
        email === "" &&
        password === "" &&
        passwordConfirm === ""
}

// Create body params
function createParams(name, surname, email, password) {
    return JSON.stringify({
        name: name.trim(),
        surname: surname.trim(),
        email: email.trim(),
        password: password
    })
}