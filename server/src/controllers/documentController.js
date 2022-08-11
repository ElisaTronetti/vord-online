const ObjectId = require('mongoose').Types.ObjectId
const Responses = require("./responses/response")
const Users = require('../models/userModel')
const ShaDocUtils =  require("./shaDocUtils")
const FileSystemUtils = require("./fileSystemUtils")

async function createNewDocument(req, res){

    try {
        const newId = new ObjectId()
        let user = await Users.findById(new ObjectId(req.body._id))

        let blocks
        if(req.body.originalDocumentId !== undefined){
            //get local document
            const originalDocument = await ShaDocUtils.getLocalDocument(req.body._id, req.body.originalDocumentId)
            blocks = originalDocument.blocks
        } else {
            blocks = []
        }

        //create document
        const newDocument = {   _id: newId,
                                title: req.body.title, 
                                time: req.body.time, 
                                blocks: blocks, 
                                version: "2.25.0"}
        await Users.findByIdAndUpdate(new ObjectId(req.body._id), { $push: { "documents": newDocument }})
        
        //create file 
        await FileSystemUtils.createFileSystemElement(req.body._id, user.fileSystem.rootFolderId, newDocument.title, newId.toString())

        //get updated user and return it
        user = await Users.findById(new ObjectId(req.body._id))

        Responses.OkResponse(res, user);
    } catch (err) {
        Responses.ServerError(res, {message: err.message});
    }
}

async function deleteDocument(req, res){
    const userId = new ObjectId(req.body.userId)
    const documentId = new ObjectId(req.body.documentId)  
    try{
        //delete from document array
        await Users.findByIdAndUpdate(userId, {$pull: {documents: {_id: documentId}}})

        //delete from fileSystem
        await FileSystemUtils.deleteFileSystemElement(req.body.userId, req.body.documentId)

        const user = await Users.findById(userId)
        Responses.OkResponse(res, user)
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