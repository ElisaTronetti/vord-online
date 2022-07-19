const SharedDocument = require('../sharedDocumentModel')

function createSharedDocument(user, doc, sharedWith) {

    return new SharedDocument({
        _id: new ObjectId(doc._id),
        title: doc.title,
        blocks: doc.blocks,
        time: doc.time,
        version: doc.version,
        author: new ObjectId(req.body.user._id),
        alreadyOpen: false,
        sharedGroup: [{
            _id: new ObjectId(req.body.user._id),
            email: req.body.user.email,
            role: 3
        },
        {
            _id: new ObjectId(req.body.sharedWith._id),
            email: req.body.sharedWith.email,
            role: req.body.sharedWith.role
        }]
    })
}

module.exports = {createSharedDocument}
