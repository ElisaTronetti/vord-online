const User = require('../userModel')

function createUser(email, name, surname, password, fileSystem) {
    return new User({
        email: email,
        name: name,
        surname: surname,
        password: password,
        fileSystem: fileSystem
    })
}

module.exports = {createUser}