import ObjectID  from 'bson-objectid'

let id = ObjectID().toHexString()

let emptyFileSystem = '{'+
    '"rootFolderId":"' + id +'",'+
    '"fileMap":{'+
       '"' + id +'":{'+
          '"id":"' + id +'",'+
          '"name":"Home",'+
          '"isDir":true,'+
          '"childrenIds":[],'+
          '"childrenCount":0'+
       '}'+
    '}'+
 '}'

export const emptyFileSystemJson = JSON.parse(emptyFileSystem)