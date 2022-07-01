const mongoose = require('mongoose')

let fileSystemSchema = new mongoose.Schema({
    _id: String,
    fileMap: [{
        _id: { type: mongoose.Types.ObjectId, auto: true },
        name: String,
        thubnail: String,
        isDir:Boolean,
        parent: String,
        childrenIds:[{
            _id: { type: mongoose.Types.ObjectId, auto: true }
        }],
        childrenCount:Number
    }]
});

module.exports = mongoose.model('fileSystem', fileSystemSchema)