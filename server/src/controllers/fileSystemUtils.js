const ObjectId = require('mongoose').Types.ObjectId
const Responses = require("./responses/response")
const Users = require('../models/userModel')
const { findByIdAndUpdate } = require('../models/userModel')
const FileFactory = require("../models/factories/fileSystem")
const ShaDocUtils = require("./shaDocUtils")

async function createFileSystemElement(userId, parentId, name, newFileId){
    let fileId
    try{
        //generate or get id
        if(!newFileId){
            fileId = new ObjectId().toString()
        } else {
            fileId = newFileId
        }

        //initialize utility variables
        const user = await Users.findById(new ObjectId(userId))
        const path = "fileSystem.fileMap." + fileId
        let element

        //if there's not file id then the new fileSystem element is a folder (viceversa is a document)
        if(!newFileId){
            element = FileFactory.createFolder(fileId, name, parentId)
        } else {
            element = FileFactory.createLocalDocument(fileId, name, parentId)
        }
         
        //insert new element in the fileSystem and update parent
        await Users.findByIdAndUpdate(new ObjectId(userId), {$set: { [path]: element}})

        await updateParent(userId, parentId, fileId, true)

    } catch (err){
        throw err
    }
}

async function deleteFileSystemElement(userId, elementId){
    try{
        //initialize utility variables
        const user = await Users.findById(new ObjectId(userId))
        const path = "fileSystem.fileMap." + elementId
        const parentId = user.fileSystem.fileMap[elementId].parentId

        if(user.fileSystem.fileMap[elementId].isDir){
            const childrenIds = user.fileSystem.fileMap[elementId].childrenIds
            let child
            for(let childId of childrenIds){
                child = user.fileSystem.fileMap[childId]

                if(child.isShared){
                    ShaDocUtils.deleteSharedDocumentForUser(userId, childId)
                } else {
                    await deleteFileSystemElement(userId, childId)
                }
            }
        }
        
        //delete element from fileSystem and update parent
        await Users.findByIdAndUpdate(new ObjectId(userId), {$unset: { [path]: 1}})
        await updateParent(userId, parentId, elementId, false)
    } catch (err){
        throw err
    }
}

async function moveElements(userId, elementIds, destination){
    try{
        for (let elementId of elementIds){
            //initialize utility variables
            const user = await Users.findById(new ObjectId(userId))
            const path = "fileSystem.fileMap." + elementId + ".parentId"
            const parentId = user.fileSystem.fileMap[elementId].parentId

            await updateParent(userId, destination, elementId, true) //put element in new folder
            await updateParent(userId, parentId, elementId, false)   //remove element from previous folder
            await Users.findByIdAndUpdate(new ObjectId(userId), {$set: {[path]: destination}}) //update parentId field of the element 
        }      
    } catch (err){
        throw err
    }
}

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
            folder.childrenIds.splice(folder.childrenIds.indexOf(fileId), 1)
            folder.childrenCount--
        }
        await Users.findByIdAndUpdate(new ObjectId(userId), {$set: { [path]: folder}})
    } catch (err){
        throw err
    }
}

module.exports = {createFileSystemElement,
                  deleteFileSystemElement,
                  moveElements,
                  updateParent}