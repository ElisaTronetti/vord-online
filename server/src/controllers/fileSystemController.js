const ObjectId = require('mongoose').Types.ObjectId
const Responces = require("./responces/responce")
const Users = require('../models/userModel')

async function updateFileSystem(req) {
    try {
        const filter = { _id: new ObjectId(req.body._id) } //userId
        const update = {fileSystem: req.body.fileSystem}

        let result = await Users.findOneAndUpdate(filter, update, {
            new: true
        });

        return result
    } catch (err) {
       throw err;
    }
  }

async function getUserFileSystem(req, res){
    if(req.query._id === undefined){
        res.status(406).json({err: "missing user id"})
    } else {
        try{
                /*const result =  await getFileSystem(req.query._id);
                if(result !== null){*/
                Users
                .findById(req.query._id)
                .select("fileSystem")
                .lean()
                .exec(function (err, fileSystem) {
                        Responces.OkResponce(res, fileSystem);//res.end(JSON.stringify(fileSystem));
                    });
               
            
        } catch(err){
            Responces.ServerError(res, {message: err.message});
        }
    }
}

async function updateUserFileSystem(req, res){
    if(req.body._id === undefined){
        res.status(406).json({err: "missing user id"})
    } else {
        try {
            let updatedFS = await updateFileSystem(req)
    
            Responces.OkResponce(res, updatedFS.fileSystem)
        } catch (err) {
            Responces.ServerError(res, {message: err.message});
        }
    }
}

async function createNewDocument(req, res){

    try {
        const newId = new ObjectId(req.body.newDocumentId)
        const filter = { _id: new ObjectId(req.body._id) } //userId

        const newDocument = {   _id: newId,
                                title: req.body.title, 
                                time: req.body.time, 
                                blocks: [], 
                                version: 0}
        const update = { $push: { "documents": newDocument }}
        
        await Users.findOneAndUpdate(filter, update)

        Responces.OkResponce(res, "");
    } catch (err) {
        Responces.ServerError(res, {message: err.message});
    }
}

async function deleteDocument(req, res){
    try{
        Users
        .updateOne({ _id: req.body.userId }, {
            $pullAll: {
                documents: [{_id: req.body.documentId}],
            },
        })
        .exec(function(req, res){
            Responces.OkResponce(res, "")
        });
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
    getUserFileSystem,
    updateUserFileSystem,
    createNewDocument,
    deleteDocument,
    getDocument,
    saveDocument
}