const ObjectId = require('mongoose').Types.ObjectId
const Users = require('../models/userModel')
const SharedDocuments = require('../models/sharedDocumentsModel')
const { findById } = require('../models/userModel')

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

async function deleteFile(userId, documentId){
    try{
        const path = "fileSystem.fileMap." + documentId
        update = {$unset: {[path]: 1}}
        const user = await Users.findByIdAndUpdate(new ObjectId(userId), update, {new: true})
        return user
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
        let i = 0, userId, user, path, newFile, folderId, folder
        const fileId = new ObjectId(doc._id)

        while(sharedGroup[i] !== undefined){

            userId = new ObjectId(sharedGroup[i]._id)
            user = await Users.findById(userId)
            if(sharedGroup[i].originalPath !== undefined){ folderId = sharedGroup[i].originalPath}
            else{folderId = user.fileSystem.rootFolderId}
            

            newFile = {
                id : fileId,
                name: doc.title + ".txt",
                parentId: folderId,
                ext: ".txt",
                isShared: true,
                color: "#27c906",
                role: sharedGroup[i].role
            }

            //insert new field in fileMap
            path = "fileSystem.fileMap." + fileId.toString()
            await Users.findByIdAndUpdate(userId, { $set: {[path]: newFile} });
            user = await Users.findById(userId)
           
            //get root folder
            folder = user.fileSystem.fileMap[folderId]

            //update root folder (if necessary) and overwrite it in the database
            if(!folder.childrenIds){
                folder.childrenIds = []
                folder.childrenCount = 0
            }
            if(folder.childrenIds.indexOf(fileId.toString()) < 0){
                folder.childrenIds.push(fileId.toString())
                folder.childrenCount++
            }

            path = "fileSystem.fileMap." + folderId
            
            await Users.findByIdAndUpdate(userId, { $set: {[path]: folder}});
            i++
        }    
    } catch (err) {
        throw err
    }
}

async function getSharedGroup(documentId){
    try{
        const res = await SharedDocuments.findById(new ObjectId(documentId))
        return res.sharedGroup
    } catch(err){
        throw err
    }
}

async function deleteSharedDocumentForUser(uId, dId){
    try{
        const documentId = new ObjectId(dId)
        const userId = new ObjectId(uId)
        let user = await Users.findById(userId)
        const parentId = user.fileSystem.fileMap[dId].parentId
        
        //delete user from document's shared group
        await SharedDocuments.findByIdAndUpdate(documentId, {$pull: {sharedGroup: {_id: userId}}})

        //delete document from user's filesystem
        const path = "fileSystem.fileMap." + dId
        await Users.findByIdAndUpdate(userId, {$unset: {[path]: 1}})
        await updateParent(uId, parentId, dId, false)
        //return updated user
        user = await Users.findById(userId)
        return user
    } catch (err){
        throw err
    }
}

async function checkAndRestoreLocalDocument(dId){
    try{
        const sharedGroup = await getSharedGroup(dId)
        if(sharedGroup.length > 1){ return }
        else {
            let user = sharedGroup[0]
            const userId = new ObjectId(user._id)
            const doc = await getSharedDocument(dId)
            const documentId = new ObjectId(dId)

            //create new local document for the user
            const newDocument = {   _id: documentId,
                                    title: doc.title, 
                                    time: 2, 
                                    blocks: doc.blocks, 
                                    version: "2.25.0"}

            await Users.findByIdAndUpdate(userId, { $push: { "documents": newDocument }})

            //update user's fileSystem
            user = await Users.findById(userId)
            const originalPath = user.fileSystem.fileMap[[dId]].parentId

            const newFile = {
                id : documentId,
                name: doc.title,
                parentId: originalPath,
                ext: ".txt",
                isShared: false
            }

            //insert new field in fileMap
            const path = "fileSystem.fileMap." + documentId.toString()
            await Users.findByIdAndUpdate(userId, { $set: {[path]: newFile} });

            //delete shared document
            await SharedDocuments.findByIdAndDelete(documentId)

            return
        }
        
    } catch (err){
        throw err
    }
}
/*
async function deleteFolder(userId, folderId){
    try{
        let elem
        const user = await Users.findById(new ObjectId(userId))
        const childrenIds = user.fileSystem.fileMap[folderId].childrenIds
        for(let elemId of childrenIds){
            elem = user.fileSystem.fileMap[elemId]
            if(elem.isDir === true){
                deleteFolder(userId, elemId) //delete folder content
                deleteFile(userId, elemId)
            } else {
                if(!elem.role){
                    //delete local file
                    await deleteDocument(userId, elemId)
                    await deleteFile(userId, elemId)
                } else {
                    //delete shared file
                    await deleteSharedDocumentForUser(userId, elemId)
                    await checkAndRestoreLocalDocument(elemId)
                }
            }
        }

        //remove folder from parent
        const parentId = user.fileSystem.fileMap[folderId].parentId
        const parent = user.fileSystem.fileMap[parentId]

        parent.childrenIds.splice(parent.childrenIds.indexOf(folderId))
        parent.childrenCount--
        const path = "fileSystem.fileMap." + parentId
        
        await Users.findByIdAndUpdate(userId, { $set: {[path]: parent}});

        //delete folder
        deleteFile(userId, folderId)

    } catch (err){
        Responses.ServerError(res, {message: err.message})
    }
}*/

async function updateParent(userId, parentId, fileId, bool){
    try{
        const user = await Users.findById(new ObjectId(userId))
        let folder = user.fileSystem.fileMap[parentId]
        const path = "fileSystem.fileMap." + parentId

        //if bool === true then add the file to the folder, else remove it
        if(bool === true){
            folder.childrenIds.push(fileId)
            folder.childrenCount++
        } else{
            folder.childrenIds.splice(folder.childrenIds.indexOf(fileId),1)
            folder.childrenCount--
        }
        await Users.findByIdAndUpdate(new ObjectId(userId), {$set: { [path]: folder}})
    } catch (err){
        throw err
    }
}
module.exports = {
    deleteDocument,
    deleteFile,
    getLocalDocument,
    getSharedDocument,
    getUserId,
    generateSharedGroup,
    checkIntersections,
    updateUsersFileSystem,
    getSharedGroup,
    deleteSharedDocumentForUser,
    checkAndRestoreLocalDocument,
}