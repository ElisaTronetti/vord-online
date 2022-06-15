const mongoose = require('mongoose')

let sharedDocumentsSchema = new mongoose.Schema({
    _id: {        //TODO decidere semantica ID
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    time: Number,
    blocks: Object,
    version: String,
    alreadyOpen: {
        type: Boolean,
        required: true
    },
    sharedGroup: {
        email: {
            type: String,
            required: true,
        },
        role: {
            type: Number,
            required: true,
        }
    }
}
)
module.exports = mongoose.model('sharedDocumentsDB', sharedDocumentsSchema)