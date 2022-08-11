function createLocalDocument(id, name, parentId) {
    return {
        id: id,
        name: name + ".txt",
        isDir: false,
        isShared: false,
        parentId: parentId,
        ext: ".txt"
    }
}

function createFolder(id, name, parentId) {
    return {
        id: id,
        name: name,
        isDir: true,
        isShared: false,
        parentId: parentId,
        childrenCount: 0,
        childrenIds: []
    }
}


module.exports = {createLocalDocument, createFolder}