const ObjectId = require('mongoose').Types.ObjectId
const Responces = require("./responces/responce")
const FileSystems = require('../models/fileSystemModel')
const Users = require('../models/userModel')


async function getFileSystem(fsId) {
    try {
        //fsId = mongoose.Types.ObjectId(fsId)
        const fileSystem = await FileSystems
                                .findById(fsId)
                                .exec();
        return fileSystem;
    } catch (err) {
       throw err;
    }
  }

async function getUserFileSystem(req, res){
    if(req.body._id === undefined){
        res.status(406).json({err: "missing user id"})
    } else {
        try{
                const result =  await getFileSystem(req.body._id);
                if(result !== null){
                    res.status(200).json({
                        result: result
                    })
                } else {
                    res.status(404).json({err: "not found"})
                }
            
        } catch(err){
            res.status(500).json({err: err.toString()})
        }
    }
}

async function updateUserFileSystem(req, res){
    if(req.body._id === undefined){
        res.status(406).json({err: "missing user id"})
    } else {
        FileSystems
        .findById(req.body._id)
        .updateOne({ fileMap: req.body.fileMap })
        .then(() => {
            Responces.OkResponce(res, req.body.fileMap);
        })
        .catch(err => {
            Responces.ServerError(res, {message: err.message});
        })
    }
}

async function createNewDocument(req, res){

    try {
        const newId = ObjectId()
        const filter = { _id: new ObjectId(req.body._id) }

        const newDocument = {   _id: newId,
                                title: req.body.title, 
                                time: req.body.time, 
                                blocks: [], 
                                version: 0}
        const updateUsers = { $push: { "documents": newDocument }}
        await Users.findOneAndUpdate(filter, updateUsers)

        const newFile = {   _id: newId,
                            name: req.body.title,
                            isDir: false,
                            childrenIds: [],
                            childrenCount: 0,
                            parendId: req.body.parent}
        const updateFiles = { $set: {
            [`fileMap.${newId}`]: newFile,
          }}
        await FileSystems.findOneAndUpdate(filter, updateFiles)

        Responces.OkResponce(res, newId)
    } catch (err) {
        Responces.ServerError(res, {message: err.message});
    }
}



module.exports = {
    getUserFileSystem,
    updateUserFileSystem,
    createNewDocument
}