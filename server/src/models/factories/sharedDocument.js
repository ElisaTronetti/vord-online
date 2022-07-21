const SharedDocument = require('../sharedDocumentsModel')
const ObjectId = require('mongoose').Types.ObjectId

function createSharedDocument(user, doc, sharedGroup) {

    const docId = new ObjectId(doc._id)
    const authorId = new ObjectId(user._id)

    return new SharedDocument({
        _id: docId,
        title: doc.title,
        blocks: doc.blocks,
        time: doc.time,
        version: doc.version,
        author: authorId,
        alreadyOpen: false,
        sharedGroup: sharedGroup
    })
}

module.exports = {createSharedDocument}
