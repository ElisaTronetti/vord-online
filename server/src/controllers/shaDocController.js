const ObjectId = require('mongoose').Types.ObjectId
const Responses = require("./responses/response")
const Users = require('../models/userModel')
const SharedDocuments = require('../models/sharedDocumentsModel')
const SharedDocumentFactory = require('../models/factories/sharedDocument')

async function deleteDocument(userId, documentId){
    const usId = new ObjectId(userId)
    const docId = new ObjectId(documentId)
    const filter = { _id: usId }
    const update = {$pull: {documents: {_id: docId}}}
    
    try{
        await Users.findOneAndUpdate(filter, update, {
            new: true
          })
    } catch (err) {
       throw err
    }
}

async function getLocalDocument(userId, documentId){
    const usId = new ObjectId(userId)
    const docId = new ObjectId(documentId)
    try{
        const result = await Users
                            .findOne({_id: usId})
                            .select({ documents: {$elemMatch: {_id: docId}}})
       
        return result.documents[0]
        
    } catch (err) {
        throw err
    }
}

async function getSharedDocument(documentId){
    try{
        const result = await SharedDocuments.findById(new ObjectId(documentId))
        return result
    } catch (err) {
        throw err
    }
}

async function getUserId(email){
    try{
        const result = await Users.findOne({email: email})
        return result._id
    } catch (err) {
        throw err
    }
}

async function generateSharedGroup(sharedGroupArray){
    let i = 0, id, _id, email, role, result = [], member
    
    try{
        while(sharedGroupArray[i] !== undefined){
            id = await getUserId(sharedGroupArray[i].email)
            _id = new ObjectId(id)
            email = sharedGroupArray[i].email
            role = parseInt(sharedGroupArray[i].role, 10)

            member = { _id, email, role }
            result.push(member)

            i = i + 1; 
        }

        return result
    } catch (err) {
        throw err
    }
   
}

async function checkIntersections(toAdd, alreadyPresent){
    let i = 0, position, newEmails = [], oldEmails = [], copy
    newEmails = toAdd.map(a => a.email);
    oldEmails = alreadyPresent.map(a => a.email);

    while (oldEmails[i] !== undefined){
        position = newEmails.indexOf(oldEmails[i])
        if(position > -1){
            toAdd.splice(position, 1) //delete one element at index = position
        }
        i = i + 1
    }
    return toAdd 
}

//share local document, create shared document, delete local document
async function shareLocalDocument(req, res){
    try{
        //get local document
        const doc = await getLocalDocument(req.body.user._id, req.body.documentId)
        if(doc !== undefined){
            let usersArray = req.body.sharedWith
            const email = req.body.user.email, role = 3
            usersArray.push({email, role})
            console.log(usersArray)
            //get shared group id's and generate shared group array
            const sharedGroup = await generateSharedGroup(usersArray)

            //generate shared document and save it to the database
            let newShaDoc = SharedDocumentFactory.createSharedDocument(req.body.user, doc, sharedGroup)
            await newShaDoc.save()

            //update shared group's respective file systems with the new file
            await updateUsersFileSystem(sharedGroup, doc)

            //delete local document and send response
            await deleteDocument(req.body.user._id, req.body.documentId).then(()=>{
                Responses.OkResponse(res, newShaDoc.sharedGroup)
            })
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
        const doc = await getSharedDocument(req.body.documentId)
        if(!doc) { Responses.NotFoundError(res, {message: "document not found"})}

        //get shared group id's and generate shared group array and see if there are intersection with current shared group
        let sharedGroup = await generateSharedGroup(req.body.sharedWith)
        const currentSharedGroup = doc.sharedGroup
        sharedGroup = await checkIntersections(sharedGroup, currentSharedGroup)

        if(sharedGroup.length === 0){ Responses.OkResponse(res, {message: "the document is already shared with these users"})}
        else{
            //push new holders in the sharedGroup array of the shared document
            while(sharedGroup[i] !== undefined){
                update = { $push: { "sharedGroup": sharedGroup[i] }}
                await SharedDocuments.findByIdAndUpdate(new ObjectId(req.body.documentId), update)
                i = i + 1
            }

            //update shared group's respective file systems with the new file
            await updateUsersFileSystem(sharedGroup, doc)
    
            Responses.OkResponse(res, sharedGroup)
        }       
    } catch (err) {
        Responses.ServerError(res, {message: err.message})
    }
}

async function updateUsersFileSystem(sharedGroup, doc){
    try{
        let i = 0, userId, user, path, newFile, rootFolderId, rootFolder
        const fileId = new ObjectId(doc._id)

        while(sharedGroup[i] !== undefined){

            userId = new ObjectId(sharedGroup[i]._id)
            user = await Users.findById(userId)
            rootFolderId = user.fileSystem.rootFolderId

            newFile = {
                id : fileId,
                name: doc.title + ".txt",
                parentId: rootFolderId,
                ext: ".txt",
                isShared: true,
                color: "#27c906",
                role: sharedGroup[i].role
            }

            //insert new field in fileMap
            path = "fileSystem.fileMap." + fileId.toString()
            await Users.findByIdAndUpdate(userId, { $set: {[path]: newFile} });

           
            //get root folder
            rootFolder = user.fileSystem.fileMap[rootFolderId]

            //update root folder (if necessary) and overwrite it in the database
            if(!rootFolder.childrenIds){
                rootFolder.childrenIds = []
                rootFolder.childrenCount = 0
            }
            if(rootFolder.childrenIds.indexOf(fileId.toString()) < 0){
                rootFolder.childrenIds.push(fileId.toString())
                rootFolder.childrenCount++
            }

            path = "fileSystem.fileMap." + rootFolderId
            await Users.findByIdAndUpdate(userId, { $set: {[path]: rootFolder}});
           
            i++
        }    
    } catch (err) {
        throw err
    }
}

module.exports = {
    shareLocalDocument,
    shareSharedDocument
}