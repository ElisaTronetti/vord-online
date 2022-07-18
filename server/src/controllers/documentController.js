const ObjectId = require('mongoose').Types.ObjectId
const Responces = require("./responces/responce")
const Users = require('../models/userModel')

async function createNewDocument(req, res){

    try {
        const newId = new ObjectId(req.body.newDocumentId)
        const filter = { _id: new ObjectId(req.body._id) } //userId

        const newDocument = {   _id: newId,
                                title: req.body.title, 
                                time: req.body.time, 
                                blocks: [], 
                                version: "2.25.0"}
        const update = { $push: { "documents": newDocument }}
        
        await Users.findOneAndUpdate(filter, update)

        Responces.OkResponce(res, "");
    } catch (err) {
        Responces.ServerError(res, {message: err.message});
    }
}

async function deleteDocument(req, res){
    const userId = new ObjectId(req.body.userId)
    const documentId = new ObjectId(req.body.documentId)
    const filter = { _id: userId }
    const update = {$pull: {documents: {_id: documentId}}}
    
    try{
        let user = await Users.findOneAndUpdate(filter, update, {
            new: true
          })
        Responces.OkResponce(res, user.documents)
    } catch (err) {
        Responces.ServerError(res, {message: err.message});
    }
} 

async function getDocument(req, res){
    try{
        Users
        .findOne({id: req.body.userId})
        .select({ documents: {$elemMatch: {_id: req.query._id}}})
        .exec(function (err, result) {
            Responces.OkResponce(res, result.documents[0]);
        });
        
    } catch (err) {
        Responces.ServerError(res, {message: err.message});
    }
}

async function saveDocument(req, res){
    try{
        
        Users.updateOne(
            { _id: req.body.userId, "documents._id": req.body.documentId },
            {
                $set: {
                    "documents.$.blocks": req.body.blocks,
                    "documents.$.time": req.body.time,
                }
            })
        .exec(function (err, result) {
            Responces.OkResponce(res, "");
        });
    } catch (err) {
        Responces.ServerError(res, {message: err.message});
    }
}

module.exports = {
    createNewDocument,
    deleteDocument,
    getDocument,
    saveDocument
}