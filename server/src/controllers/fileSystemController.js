const ObjectId = require('mongoose').Types.ObjectId
const Responses = require("./responses/response")
const Users = require('../models/userModel')
const FileSystemUtils = require("./fileSystemUtils")
const DocumentLock = require("../middleware/documentLock")
const ShaDocUtils = require("./shaDocUtils")



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
        const sharedDocuments = await FileSystemUtils.findAllSharedDocumentsInFolder(req.body.userId, req.body.folderId)
        const documentLocks = DocumentLock.getDocumentLocks()
        const lockedDocuments =  documentLocks.filter(x => sharedDocuments.includes(x.documentId.toString()))
        if(lockedDocuments.length !== 0){
            const documentName = await Users.findById(new ObjectId(req.body.userId)).fileSystem.fileMap[lockedDocuments[0].documentId].name
            Responses.ConflictError(res, {message:"Operation forbidden: "+documentName+" is a shared file and is opened by a user."})
        }
        await FileSystemUtils.deleteFileSystemElement(req.body.userId, req.body.folderId)
        const user = await Users.findById(new ObjectId(req.body.userId))
        Responses.OkResponse(res, user);
    } catch (err) { 
        Responses.ServerError(res, {message: err.message});
    }
}

async function moveElements(req, res){
    try {
        await FileSystemUtils.moveElements(req.body.userId, req.body.elementIds, req.body.destinationId)
        const user = await Users.findById(new ObjectId(req.body.userId))
        Responses.OkResponse(res, user);
    } catch (err) {
        Responses.ServerError(res, {message: err.message});
    }
}

async function renameElement(req, res){
    try {
        const path = "fileSystem.fileMap."+req.body.elemId+".name"
        await Users.findByIdAndUpdate(new ObjectId(req.body.userId), {$set: {[path]: req.body.newName}})
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
            //retrieve the user and the list of locked documents. 
            let user = await Users.findById(req.query._id)
            let documentLocks = DocumentLock.getDocumentLocks()
            documentLocks = documentLocks.map(d => d.documentId)
            const fileMapAsArray =  Object.keys(user.fileSystem.fileMap)

            //find all locked documents in the user's filesystem and mark them as such in the data structure that will be sent to the client
            const lockedDocsTheUserPossess = fileMapAsArray.filter(fsElem => documentLocks.includes(fsElem))
           
            for(let elem of lockedDocsTheUserPossess){
                user.fileSystem.fileMap[elem].isEncrypted = true
            }
            Responses.OkResponse(res, user.fileSystem);
                
        } catch(err){
            console.log(err)
            Responses.ServerError(res, {message: err.message});
        }
    }
}

module.exports = {
    getUserFileSystem,
    createFolder,
    deleteFolder,
    moveElements,
    renameElement
}