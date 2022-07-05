const mongoose = require('mongoose')

let fileSystemSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    rootFolderId: { type: mongoose.Types.ObjectId, auto: true },
    fileMap:
        {type: Map, of:{ 
            id: { type: mongoose.Types.ObjectId, auto: true },
            name: String,
            thubnail: String,
            isDir:Boolean,
            parent: String,
            childrenIds:[{
                id: { type: mongoose.Types.ObjectId, auto: true }
            }],
            childrenCount: Number
        }
    }
}, { strict: false });

module.exports = mongoose.model('fileSystem', fileSystemSchema)