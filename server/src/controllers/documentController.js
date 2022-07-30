const ObjectId = require('mongoose').Types.ObjectId
const Responses = require("./responses/response")
const Users = require('../models/userModel')

async function createNewDocument(req, res){

    try {
        const newId = new ObjectId(req.body.newDocumentId)
        const filter = { _id: new ObjectId(req.body._id) } //userId
        let blocks
        if(req.body.blocks !== undefined){
            blocks = req.body.blocks
        } else {
            blocks = []
        }

        const newDocument = {   _id: newId,
                                title: req.body.title, 
                                time: req.body.time, 
                                blocks: blocks, 
                                version: "2.25.0"}
        const update = { $push: { "documents": newDocument }}
        
        await Users.findOneAndUpdate(filter, update)

        Responses.OkResponse(res, "");
    } catch (err) {
        Responses.ServerError(res, {message: err.message});
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
        Responses.OkResponse(res, user.documents)
    } catch (err) {
        Responses.ServerError(res, {message: err.message});
    }
} 

async function getDocument(req, res){
    try{
        Users
        .findOne({id: req.body.userId})
        .select({ documents: {$elemMatch: {_id: req.query._id}}})
        .exec(function (err, result) {
            Responses.OkResponse(res, result.documents[0]);
        });
        
    } catch (err) {
        Responses.ServerError(res, {message: err.message});
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
            Responses.OkResponse(res, "");
        });
    } catch (err) {
        Responses.ServerError(res, {message: err.message});
    }
}

module.exports = {
    createNewDocument,
    deleteDocument,
    getDocument,
    saveDocument
}