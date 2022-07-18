const ObjectId = require('mongoose').Types.ObjectId
const Responces = require("./responces/responce")
const Users = require('../models/userModel')
const SharedDocuments = require('../models/sharedDocumentsModel')

async function deleteDocument(req){
    try {
        await Users
        .updateOne({ _id: req.body.userId }, {
            $pullAll: {
                documents: [{_id: req.body.documentId}],
            },
        })
    } catch (err) {
       throw err;
    }
}

async function shareDocument(req, res){
    
}