const mongoose = require('mongoose')

let sharedDocumentsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: Object,
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
module.exports = mongoose.model('sharedDocument', sharedDocumentsSchema)