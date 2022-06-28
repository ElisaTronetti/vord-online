const ObjectId = require('mongoose').Types.ObjectId
const Responces = require("./responces/responce")
const Users = require('../models/userModel')

async function getFileSystem(userId) {
    try {
        const fileSystem = await Users
                                .findOne({email : userId})
                                .select('fileSystem')
                                .exec();
        return fileSystem;
    } catch (err) {
       throw err;
    }
  }

async function getUserFileSystem(req, res){
    if(req.query.id === undefined){
        res.status(406).json({err: "missing user id"})
    } else {
        try{
                const result =  await getFileSystem(req.query.id);
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
    if(req.query.id === undefined){
        res.status(406).json({err: "missing user id"})
    } else {
        Users
        .find({email : req.query.id})
        .updateOne({ fileSystem: req.body.fileSystem })
        .then(() => {
            Responces.OkResponce(res, req.body.fileSystem);
        })
        .catch(err => {
            Responces.ServerError(res, {message: err.message});
        })
    }
}



module.exports = {
    getUserFileSystem,
    updateUserFileSystem
}