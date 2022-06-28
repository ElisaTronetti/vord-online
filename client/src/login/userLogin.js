import $ from 'jquery'
import { server } from '../conf'
import { setToken } from "../redux/userData/actions"

export default function userLogin(email, password, dispatch) {
    if (email !== '' && password !== '') {
        $.ajaxSetup({
            contentType: "application/json; charset=utf-8"
        })
        $.post(server + "auth/login", createParams(email, password))
            .done(function (result) {
                console.log(result)
                let token = result.token
                dispatch(setToken(token))
            })
            .fail(function (result) {
                console.log(result)
            })
    }
}

function createParams(email, password) {
    return JSON.stringify({
        email: email,
        password: password
    })
}