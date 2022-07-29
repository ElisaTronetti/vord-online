const ObjectId = require('mongoose').Types.ObjectId
const Responses = require("./responses/response")
const SharedDocuments = require('../models/sharedDocumentsModel')
const SharedDocumentFactory = require('../models/factories/sharedDocument')
const Utils =  require("./shaDocUtils")

//share local document, create shared document, delete local document
async function shareLocalDocument(req, res){
    try{
        //get local document
        const doc = await Utils.getLocalDocument(req.body.user._id, req.body.documentId)
        if(doc !== undefined){
            let usersArray = req.body.sharedWith
            const email = req.body.user.email, role = 3
            usersArray.push({email, role})
            console.log(usersArray)
            //get shared group id's and generate shared group array
            const sharedGroup = await Utils.generateSharedGroup(usersArray)

            //generate shared document and save it to the database
            let newShaDoc = SharedDocumentFactory.createSharedDocument(req.body.user, doc, sharedGroup)
            await newShaDoc.save()

            //update shared group's respective file systems with the new file
            await Utils.updateUsersFileSystem(sharedGroup, doc)

            //delete local document and send response
            await Utils.deleteDocument(req.body.user._id, req.body.documentId).then(()=>{
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

module.exports = {
    shareLocalDocument,
    shareSharedDocument
}