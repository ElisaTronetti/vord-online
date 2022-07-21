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

async function getDocument(userId, documentId){
    const usId = new ObjectId(userId)
    const docId = new ObjectId(documentId)
    try{
        const result = await Users
                            .findOne({id: usId})
                            .select({ documents: {$elemMatch: {_id: docId}}})
       
        return result.documents[0]
        
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

async function generateSharedGroup(sharedGroupArray, owner){
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
        
        //adding file owner to share group
        _id = new ObjectId(owner._id)
        email = owner.email
        role = 3
        member = { _id, email, role }
        result.push(member)

        return result
    } catch (err) {
        throw err
    }
   
}

//share local document, create shared document, delete local document
async function shareLocalDocument(req, res){
    try{
        //get local document
        const doc = await getDocument(req.body.user._id, req.body.documentId)
        if(doc !== undefined){
            //get shared group id's and generate shared group array
            const sharedGroup = await generateSharedGroup(req.body.sharedWith, req.body.user)

            //generate shared document and save it to the database
            let newShaDoc = SharedDocumentFactory.createSharedDocument(req.body.user, doc, sharedGroup)
            await newShaDoc.save()

            //delete local document and send response
            await deleteDocument(req.body.user._id, req.body.documentId).then(()=>{
                Responses.OkResponse(res, newShaDoc.sharedGroup);
            })
        } else {
            Responses.ConflictError(res, {message: "404 document not found"}); //TODO che ci devo scrivere?
        }
        
    } catch (err) {
        Responses.ServerError(res, {message: err.message});
    }
}

async function shareSharedDocument(req, res){
    try{
        const userId = new ObjectId(await getUserId(req.body.email))
        
        const filter = { _id: new ObjectId(req.body.documentId) }
        
        const newHolder = { _id: userId,
                            email: req.body.email,
                            role: req.body.role }
        const update = { $push: { "sharedGroup": newHolder }}
        
        await SharedDocuments.findOneAndUpdate(filter, update)

        Responses.OkResponse(res, "");
    } catch (err) {
        Responses.ServerError(res, {message: err.message});
    }
}

module.exports = {
    shareLocalDocument,
    shareSharedDocument
}