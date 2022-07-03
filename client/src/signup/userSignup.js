import $ from 'jquery'
import { setToken, setId } from "../redux/userData/actions"

export default function userSignup(name, surname, email, password, passwordConfirm, dispatch) {
    if (emptyParams(name, surname, email, password, passwordConfirm)) {
        console.log("Empty fields")
    } else if (password.trim() !== passwordConfirm.trim()) {
        console.log("Wrong password confirm")
    } else {
        $.ajaxSetup({
            contentType: "application/json; charset=utf-8"
        })
        $.post(process.env.REACT_APP_SERVER + "auth/signup", createParams(name, surname, email, password))
            .done(function (result) {
                console.log(result)

                let token = result.token
                dispatch(setToken(token))

                let id = result._id
                dispatch(setId(id))
            })
            .fail(function (result) {
                console.log(result)
            })
    }
}

function emptyParams(name, surname, email, password, passwordConfirm) {
    return name === "" &&
        surname === "" &&
        email === "" &&
        password === "" &&
        passwordConfirm === ""
}

function createParams(name, surname, email, password) {
    return JSON.stringify({
        name: name,
        surname: surname,
        email: email,
        password: password
    })
}