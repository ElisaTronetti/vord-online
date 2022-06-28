import $ from 'jquery'
import { server } from '../conf'

export default function userLogin(email, password){
    if(email !== '' && password !== ''){
        $.ajaxSetup({
            contentType: "application/json; charset=utf-8"
        })
        $.get(server + "auth/login", createParams(email, password))
            .done(function (result) {
                console.log(result)
            })
            .fail(function (result) {
                if(result.status === 401){
                    alert.error("Invalid credentials")
                } else {
                    alert.error("Error contacting server")
                }
            })
    } /*else {
        alert.error("Email and/or password cannot be empty")
    }*/
}

function createParams(email, password) {
    return {
        email: email.trim(),
        password: password.trim()
    }
}