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
        const newId = req.body.newDocumentId
        const filter = { _id: new ObjectId(req.body._id) } //userId

        const newDocument = {   _id: newId,
                                title: req.body.title, 
                                time: req.body.time, 
                                blocks: [], 
                                version: 0}
        const updateUsers = { $push: { "documents": newDocument }}
        await Users.findOneAndUpdate(filter, updateUsers)

        let updatedFS = await updateFileSystem(req)

        Responces.OkResponce(res, updatedFS.fileSystem)
    } catch (err) {
        Responces.ServerError(res, {message: err.message});
    }
}



module.exports = {
    getUserFileSystem,
    updateUserFileSystem,
    createNewDocument
}