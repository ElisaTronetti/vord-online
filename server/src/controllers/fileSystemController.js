const ObjectId = require('mongoose').Types.ObjectId
const Responses = require("./responses/response")
const Users = require('../models/userModel')
const FileSystemUtils = require("./fileSystemUtils")

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

async function createFolder(req, res){
    try {
        await FileSystemUtils.createFileSystemElement(req.body.userId, req.body.parentId, req.body.name)
        const user = await Users.findById(new ObjectId(req.body.userId))
        Responses.OkResponse(res, user);
    } catch (err) {
        Responses.ServerError(res, {message: err.message});
    }
}

async function deleteFolder(req, res){
    try {
        await FileSystemUtils.deleteFileSystemElement(req.body.userId, req.body.folderId)
        const user = await Users.findById(new ObjectId(req.body.userId))
        Responses.OkResponse(res, user);
    } catch (err) {
        Responses.ServerError(res, {message: err.message});
    }
}

async function moveElement(req, res){
    try {
        await FileSystemUtils.moveElement(req.body.userId, req.body.elementId, req.body.destinationId)
        const user = await Users.findById(new ObjectId(req.body.userId))
        Responses.OkResponse(res, user);
    } catch (err) {
        Responses.ServerError(res, {message: err.message});
    }
}

async function getUserFileSystem(req, res){
    if(req.query._id === undefined){
        res.status(406).json({err: "missing user id"})
    } else {
        try{
            const user = await Users.findById(req.query._id)
            Responses.OkResponse(res, user.fileSystem);
                
        } catch(err){
            Responses.ServerError(res, {message: err.message});
        }
    }
}

async function updateUserFileSystem(req, res){
    if(req.body._id === undefined){
        res.status(406).json({err: "missing user id"})
    } else {
        try {
            let updatedFS = await updateFileSystem(req)
    
            Responses.OkResponse(res, updatedFS.fileSystem)
        } catch (err) {
            Responses.ServerError(res, {message: err.message});
        }
    }
}

module.exports = {
    getUserFileSystem,
    updateUserFileSystem,
    createFolder,
    deleteFolder,
    moveElement
}