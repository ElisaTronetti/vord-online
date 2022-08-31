function createLocalDocument(id, name, parentId) {
    return {
        id: id,
        name: name + ".txt",
        isDir: false,
        isShared: false,
        parentId: parentId,
        ext: ".txt",
        color: "#3C47CB"
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
        childrenIds: [],
        color: "#A5CCD6"
    }
}

function createSharedDocument(id, title, parentId, role){
    return {
        id : id,
        name: title + ".txt",
        parentId: parentId,
        ext: ".txt",
        isShared: true,
        color: "#41014d",//"#8e00a8",
        role: role
    }
}


module.exports = {createLocalDocument, 
                  createFolder,
                  createSharedDocument}