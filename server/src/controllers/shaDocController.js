const ObjectId = require('mongoose').Types.ObjectId
const Responses = require("./responses/response")
const SharedDocuments = require('../models/sharedDocumentsModel')
const SharedDocumentFactory = require('../models/factories/sharedDocument')
const Utils = require("./shaDocUtils")
const Users = require('../models/userModel')

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
            
            if(sharedGroup.length == 1 && sharedGroup[0].email == email){
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
        if(!doc){
            Responses.ServerError(res, {message: "File already opened or non existing"})
        } else {
            const docId = new ObjectId(doc._id)
            const sharedGroup = await Utils.generateSharedGroup(req.body.sharedWith)
            const alreadyPresent = await Utils.getSharedGroup(req.body.documentId)

            newEmails = sharedGroup.map(a => a.email);
            oldEmails = alreadyPresent.map(a => a.email);
            let toRemove = alreadyPresent.filter(x => !newEmails.includes(x.email))
            let toUpdate = alreadyPresent.filter(x => newEmails.includes(x.email) &&
                                                      sharedGroup.find(y => y.email === x.email).role !== x.role) //exclude new users

            let originalPathToMantain, index, updatedMember
            for(let userToUpdate of toUpdate){
                //remove users to update from shared group (will be reinserted with updated role)
                //do not remove the file from their fileSystems, because il will be updated in the updateUsersFilesystems
                alreadyPresent.splice(alreadyPresent.indexOf(userToUpdate), 1)

                //get the parent folder of the shared file in the user to update fileSystem
                originalPathToMantain = await Users.findById(new ObjectId(userToUpdate._id))
                originalPathToMantain = originalPathToMantain.fileSystem.fileMap[doc._id].parentId

                //find the index of the user to update in the new shared group array, remove it and re add it with the orginalpath field
                index = sharedGroup.map(object => object.email).indexOf(userToUpdate.email)
                updatedMember = {_id: new ObjectId(userToUpdate._id), 
                                 email: userToUpdate.email, 
                                 role: sharedGroup[index].role, 
                                 originalPath: originalPathToMantain
                                }
                sharedGroup.splice(index, 1)
                sharedGroup.push(updatedMember)
            }

            //now remove both these users from the shared group of the document and the file from their fileSystems
            for(let userToRemove of toRemove){
                await Utils.deleteSharedDocumentForUser(userToRemove._id, docId.toString())
            }

            await SharedDocuments.findByIdAndUpdate(docId, {$set: {sharedGroup: sharedGroup}})

            //update new and updated members's filesystems
            await Utils.updateUsersFileSystem(sharedGroup, doc)
            
            //check if the shared group is composed by only one user, and if it is convert the shared document in local document of that user
            await Utils.checkAndRestoreLocalDocument(docId)
            
            const result = await Users.findById(new ObjectId(req.body.user._id))
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
        await Utils.checkAndRestoreLocalDocument(req.body.documentId)

        Responses.OkResponse(res, user)
    } catch (err){
        Responses.ServerError(res, {message: err.message})
    }
}

async function deleteForAll(req, res){
    try{
        const sharedGroup = await Utils.getSharedGroup(req.body.documentId)
                
        for (let member of sharedGroup) {
            await Utils.deleteSharedDocumentForUser(member._id, req.body.documentId)
        }

        //return updated user
        const result = await Users.findById(new ObjectId(req.body.user._id))
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