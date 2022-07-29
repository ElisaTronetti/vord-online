const ObjectId = require('mongoose').Types.ObjectId
const Users = require('../models/userModel')
const SharedDocuments = require('../models/sharedDocumentsModel')

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
    deleteDocument,
    getLocalDocument,
    getSharedDocument,
    getUserId,
    generateSharedGroup,
    checkIntersections,
    updateUsersFileSystem
}