import $ from 'jquery'

export default function getFileSystem(id, token, setCurrentFolderId, setFileMap) {
   $.ajax({
        contentType: 'application/json',
        headers: {"token": token},
        dataType: 'json',
        success: function (result) {
            console.log(result)
            let id = result.rootFolderId
            setCurrentFolderId(id)

            let fileMap = result.fileMap
            setFileMap(fileMap)
        },
        error: function () {
            console.log('error')
        },
        processData: false,
        type: 'GET',
        url: process.env.REACT_APP_SERVER + "fileSystem/getUserFileSystem?_id=" + id
    })
}
