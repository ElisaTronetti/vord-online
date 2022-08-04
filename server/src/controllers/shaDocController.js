const ObjectId = require('mongoose').Types.ObjectId
const Responses = require("./responses/response")
const SharedDocuments = require('../models/sharedDocumentsModel')
const SharedDocumentFactory = require('../models/factories/sharedDocument')
const Utils = require("./shaDocUtils")
const Users = require('../models/userModel')
const { updateUserFileSystem } = require('./fileSystemController')

//share local document, create shared document, delete local document
async function shareLocalDocument(req, res){
    try{
        //get local document
        const doc = await Utils.getLocalDocument(req.body.user._id, req.body.documentId)
        if(doc !== undefined){
            let usersArray = req.body.sharedWith, originalPath = undefined
            const email = req.body.user.email, role = 3, _id = new ObjectId(req.body.user._id)
            
            //find the original parent folder of the local file to reinsert the shared version correctly in original autor's filesystem
            const user = await Users.findById(_id)
            originalPath = user.fileSystem.fileMap[[req.body.documentId]].parentId

            //get shared group id's and generate shared group array
            const sharedGroup = await Utils.generateSharedGroup(usersArray)
            if(sharedGroup.length() == 1 && sharedGroup[0].email == email){
                Responses.ConflictError(res, {message: "cannot share a document with oneself"})
            } else {
                //push author
                sharedGroup.push({_id, email, role, originalPath})

                //generate shared document and save it to the database
                let newShaDoc = SharedDocumentFactory.createSharedDocument(req.body.user, doc, sharedGroup)
                await newShaDoc.save()

                //update shared group's respective file systems with the new file
                await Utils.updateUsersFileSystem(sharedGroup, doc)

                //delete local document and send response
                await Utils.deleteDocument(req.body.user._id, req.body.documentId).then(()=>{
                    Responses.OkResponse(res, newShaDoc.sharedGroup)
                })
            }
            
        } else {
            Responses.NotFoundError(res, {message: "document not found"})
        }
        
    } catch (err) {
        Responses.ServerError(res, {message: err.message})
    }
}

async function shareSharedDocument(req, res){
    try{
        let user = [], _id, role, i = 0, update
        const doc = await Utils.getSharedDocument(req.body.documentId)
        if(!doc) { Responses.NotFoundError(res, {message: "document not found"})}

        //get shared group id's and generate shared group array and see if there are intersection with current shared group
        let sharedGroup = await Utils.generateSharedGroup(req.body.sharedWith)
        const currentSharedGroup = doc.sharedGroup
        sharedGroup = await Utils.checkIntersections(sharedGroup, currentSharedGroup)

        if(sharedGroup.length === 0){ Responses.OkResponse(res, {message: "the document is already shared with these users"})}
        else{
            //push new holders in the sharedGroup array of the shared document
            while(sharedGroup[i] !== undefined){
                update = { $push: { "sharedGroup": sharedGroup[i] }}
                await SharedDocuments.findByIdAndUpdate(new ObjectId(req.body.documentId), update)
                i = i + 1
            }

            //update shared group's respective file systems with the new file
            await Utils.updateUsersFileSystem(sharedGroup, doc)
    
            Responses.OkResponse(res, sharedGroup)
        }       
    } catch (err) {
        Responses.ServerError(res, {message: err.message})
    }
}

async function manageSharedGroup(req, res){
    try{
        const doc = await Utils.getSharedDocument(req.body.documentId)
        if(!doc || doc.alreadyOpen){
            Responses.ServerError(res, {message: "File already opened or non existing"})
        } else {
            const docId = new ObjectId(doc._id)

            //empty the shared group
            await SharedDocuments.findByIdAndUpdate(docId, { $set: { "sharedGroup": [] } })
            
            //re-generate sharedGroup with the body.sharedWith array and the user who has used this operation. 
            let i = 0, userArray = req.body.sharedWith
            const role = 3, email = req.body.user.email
            userArray.push({email, role})
            const sharedGroup = await Utils.generateSharedGroup(userArray)

            //update shared group and return it
            while(sharedGroup[i] !== undefined){
                await SharedDocuments.findByIdAndUpdate(docId, {$push: {"sharedGroup": sharedGroup[i] } } )
                i++
            }
            
            const result = await Utils.getSharedGroup(req.body.documentId)
            Responses.OkResponse(res, result)
        }
    } catch (err){
        Responses.ServerError(res, {message: err.message})
    }
}

async function getSharedGroup(req, res){
    try{
        SharedDocuments.findById(new ObjectId(req.headers["documentid"])).then((doc)=>{
            Responses.OkResponse(res, doc.sharedGroup)
        })
    } catch (err){
        Responses.ServerError(res, {message: err.message})
    }
}

async function getSharedDocument(req, res){
    try{
        SharedDocuments.findById(new ObjectId(req.headers["documentid"])).then((doc)=>{
            Responses.OkResponse(res, doc)
        })
    } catch (err){
        Responses.ServerError(res, {message: err.message})
    }
}

async function saveSharedDocument(req, res){
    try{
        const update = {$set:{"blocks":req.body.blocks}}
        SharedDocuments.findByIdAndUpdate(new ObjectId(req.body.documentId), update)
        .then((doc)=>{
            Responses.OkResponse(res, doc)
        })
    } catch (err){
        Responses.ServerError(res, {message: err.message})
    }
}

async function deleteForMe(req, res){
    try{
        const user = await Utils.deleteSharedDocumentForUser(req.body.user._id, req.body.documentId)

        //check if the shared group is composed by only one user, and if it is convert the shared document in local document of that user
        await checkAndRestoreLocalDocument(req.body.documentId)

        Responses.OkResponse(res, user)
    } catch (err){
        Responses.ServerError(res, {message: err.message})
    }
}

async function deleteForAll(req, res){
    try{
        const sharedGroup = await Utils.getSharedGroup(req.body.documentId)
        let user, result
        
        for (let member of sharedGroup) {
            user = await Utils.deleteSharedDocumentForUser(member._id, req.body.documentId)
            if(user._id === new ObjectId(req.body.user._id)){result = user}
        }
        
        //return updated user
        Responses.OkResponse(res, result)
    } catch (err){
        Responses.ServerError(res, {message: err.message})
    }
}

module.exports = {
    shareLocalDocument,
    shareSharedDocument,
    manageSharedGroup,
    getSharedGroup,
    getSharedDocument,
    saveSharedDocument,
    deleteForMe,
    deleteForAll
}