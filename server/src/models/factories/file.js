const User = require('../userModel')

function createFile(title, time, version) {
    const Document = User.select('documents');

    return new Document({
        title: title,
        time: time,
        blocks: [],
        version: version
    })
}

module.exports = {createFile}
