const User = require('../userModel')
const ObjectId = require('mongoose').Types.ObjectId

function createUser(email, name, surname, password) {
    let newId = new ObjectId()
    const rootFolderId = newId.toString()
    const fileSystem = {
      rootFolderId : rootFolderId,
      fileMap: {
        [newId] : {
          id: newId.toString(),
          name: "Home",
          isShared: false,
          isDir: true,
          childrenCount: 0,
          childrenIds: []
        }
      }
    }
    console.log(fileSystem)
    return new User({
        email: email,
        name: name,
        surname: surname,
        password: password,
        fileSystem: fileSystem
    })
}

module.exports = {createUser}