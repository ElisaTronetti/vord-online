// Used to recreate the file system JSON data structure
export function recreateFileSystem(rootFolderId, fileMap) {
   return JSON.parse('{"rootFolderId":"' + rootFolderId + '", ' +
      '"fileMap":' + JSON.stringify(fileMap) + '}')
}
