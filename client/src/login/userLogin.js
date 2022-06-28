import $ from 'jquery'
import { server } from '../conf'

export default function userLogin(email, password) {
    if (email !== '' && password !== '') {
        $.ajaxSetup({
            contentType: "application/json; charset=utf-8"
        })
        $.post(server + "auth/login", createParams(email, password))
            .done(function (result) {
                console.log(result)
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