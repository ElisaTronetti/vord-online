let emptyFileSystem = '{'+
    '"rootFolderId":"qwerty123456",'+
    '"fileMap":{'+
       '"qwerty123456":{'+
          '"id":"qwerty123456",'+
          '"name":"Chonky Demo",'+
          '"isDir":true,'+
          '"childrenIds":['+
             '"e598a85f843c"'+
          '],'+
          '"childrenCount":1'+
       '},'+
       '"e598a85f843c":{'+
          '"id":"e598a85f843c",'+
          '"name":"Chonky Source Code",'+
          '"isDir":true,'+
          '"modDate":"2020-10-24T17:48:39.866Z",'+
          '"childrenIds":[],'+
          '"childrenCount":0,'+
          '"parentId":"qwerty123456"'+
       '}'+
    '}'+
 '}'

export const emptyFileSystemJson = JSON.parse(emptyFileSystem)