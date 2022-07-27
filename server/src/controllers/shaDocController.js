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
            role = sharedGroupArray[i].role

            member = { _id, email, role }
            result.push(member)

            i = i + 1; 
        }

        return result
    } catch (err) {
        throw err
    }
   
}

async function updateUsers(sharedGroup, doc, authorId){
    let i = 0, newFileSharedWithUser, update, filter
    
    try{
        while (sharedGroup[i] !== undefined){
            newFileSharedWithUser = { _id: new ObjectId(doc._id),
                                        title: doc.title,
                                        author: new ObjectId(authorId),
                                        role: sharedGroup[i].role,
                                        }

            console.log(sharedGroup[i]._id)
            update = {$push: {"sharedWithUser": newFileSharedWithUser}}
            filter = {_id : sharedGroup[i]._id}
            await Users.findOneAndUpdate(filter, update)
            i = i + 1
        }
    } catch (err) {
        throw err
    }
}

function checkIntersections(toAdd, alreadyPresent){
    let i = 0, position
    while (toAdd[i] !== undefined){
        position = alreadyPresent.indexOf(toAdd[i])
        if(position !== -1){
            toAdd.splice(position, 1) //delete one element at index = position
        }
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
            //get shared group id's and generate shared group array
            const sharedGroup = await generateSharedGroup(usersArray)

            //generate shared document and save it to the database
            let newShaDoc = SharedDocumentFactory.createSharedDocument(req.body.user, doc, sharedGroup)
            await newShaDoc.save()

            //update each user sharedWithUser array
            await updateUsers(sharedGroup, doc, req.body.user._id)

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
        sharedGroup = checkIntersections(sharedGroup, currentSharedGroup)
        if(sharedGroup.length === 0){ Responses.OkResponse(res, doc.sharedGroup) }

        while(sharedGroup[i] !== undefined){
            update = { $push: { "sharedGroup": sharedGroup[i] }}
            await SharedDocuments.findByIdAndUpdate(new ObjectId(req.body.documentId), update)
            i = i + 1
        }

        //update new holders sharedWithMe array
        await updateUsers(sharedGroup, doc, doc.author)

        Responses.OkResponse(res, doc.sharedGroup)
    } catch (err) {
        Responses.ServerError(res, {message: err.message})
    }
}

module.exports = {
    shareLocalDocument,
    shareSharedDocument
}