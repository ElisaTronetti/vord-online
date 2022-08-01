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
          '"childrenCount":0,'+
          '"isShared":false'+
       '}'+
    '}'+
 '}'

export const emptyFileSystemJson = JSON.parse(emptyFileSystem)

// Used to recreate the file system JSON data structure
export function recreateFileSystem(rootFolderId, fileMap) {
   return JSON.parse('{"rootFolderId":"' + rootFolderId + '", ' +
     '"fileMap":' + JSON.stringify(fileMap) + '}')
 }
 