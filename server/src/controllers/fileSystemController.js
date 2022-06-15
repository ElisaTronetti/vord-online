const ObjectId = require('mongoose').Types.ObjectId

const Settings = require('../models/userModel')

async function getUserFileSystem(req, res){
    if(req.query.id === undefined){
        res.status(406).json({err: "missing user id"})
    } else {
        Settings.findById(new ObjectId(req.query.id))
            .select('fileSystem')
            .then(async result => {
                if(result !== null){
                    res.status(200).json({
                        fileSystem: result
                    })
                } else {
                    res.status(404).json({err: "not found"})
                }
            }
        ).catch(err => {
            res.status(500).json({err: err.toString()})
        })
    }
}

module.exports = {
    getUserFileSystem
}