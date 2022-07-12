import $ from 'jquery'

export function getFileSystem(id, token) {
   $.ajax({
        contentType: 'application/json',
        headers: {"token": token},
        success: function (result) {
            console.log(result)
        },
        error: function () {
            console.log('error')
        },
        processData: false,
        type: 'GET',
        url: process.env.REACT_APP_SERVER + "fileSystem/getUserFileSystem?_id=" + id
    })
}

export function updateFileSystem(id, token, fileSystem) {
    $.ajax({
         contentType: 'application/json',
         headers: {"token": token},
         dataType: 'json',
         data: createParams(id, fileSystem),
         success: function (result) {
             console.log("AA" + result)
         },
         error: function () {
             console.log('error')
         },
         type: 'POST',
         url: process.env.REACT_APP_SERVER + "fileSystem/updateUserFileSystem"
     })
 }

 function createParams(id, fileSystem) {
    return JSON.stringify({
        _id: id,
        fileSystem: fileSystem
    })
}