const User = require('../userModel')

function createUser(email, name, surname, password) {
    return new User({
        email: email,
        name: name,
        surname: surname,
        password: password,
        fileSystem: []
    })
}

module.exports = {createUser}