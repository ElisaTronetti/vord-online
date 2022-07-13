import { v4 as uuidv4 } from 'uuid'

let uuid = uuidv4()

let emptyFileSystem = '{'+
    '"rootFolderId":"' + uuid +'",'+
    '"fileMap":{'+
       '"' + uuid +'":{'+
          '"id":"' + uuid +'",'+
          '"name":"Home",'+
          '"isDir":true,'+
          '"childrenIds":[],'+
          '"childrenCount":0'+
       '}'+
    '}'+
 '}'

export const emptyFileSystemJson = JSON.parse(emptyFileSystem)