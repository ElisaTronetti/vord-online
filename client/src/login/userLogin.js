import $ from 'jquery'
import { setToken, setId } from "../redux/userData/actions"
import { setRootFolderId, setFileMap} from '../redux/fileSystemData/actions'

export default function userLogin(email, password, dispatch) {
    if (email !== '' && password !== '') {
        $.ajaxSetup({
            contentType: "application/json; charset=utf-8"
        })
        $.post(process.env.REACT_APP_SERVER + "auth/login", createParams(email, password))
            .done(function (result) {

                let token = result.token
                dispatch(setToken(token))

                let id = result._id
                dispatch(setId(id))
                
                if (result.fileSystem !== undefined) {
                    let fileSystem = result.fileSystem
                    console.log('A file system exists ' + fileSystem)
                    dispatch(setRootFolderId(fileSystem.rootFolderId))
                    dispatch(setFileMap(fileSystem.fileMap))
                }

            })
            .fail(function (result) {
                console.log(result)
            })
    } else {
        console.log('Missing data')
    }
}

function createParams(email, password) {
    return JSON.stringify({
        email: email,
        password: password
    })
}