const ObjectId = require('mongoose').Types.ObjectId
const Responces = require("./responces/responce")
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
    try{
        Users
        .findOne({id: userId})
        .select({ documents: {$elemMatch: {_id: documentId}}})
        .exec(function (err, result) {
            return result.documents[0]
        });
        
    } catch (err) {
        throw err
    }
}

async function shareLocalDocument(req, res){
    try{
        const doc = await getDocument(req.user._id, documentId).then(()=>{
            if(doc !== undefined){
                let newShaDoc = SharedDocumentFactory.createSharedDocument(req.user, doc, req.sharedWith)

                await newShaDoc.save().then(()=>{
                    await deleteDocument(req.user._id, documentId).then(()=>{
                        Responces.OkResponce(res, newShaDoc.sharedGroup);
                    })
                })
            }
        });
    } catch (err) {
        Responces.ServerError(res, {message: err.message});
    }
}