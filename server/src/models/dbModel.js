const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

    let vordSchema = new mongoose.Schema({
        users:{
            email:{
                type: String,
                required: true,
                unique: true
            },
            name:{
                type: String,
                required: true
            },
            surname:{
                type: String,
                required: true
            },
            password: {
                type: String,
                required: true
            },
            salt: {
                type: String,
                required: true
            },
            fileSystem: {
                type: Object,
                required: true
            },
            documents: {            //documents of the user
                _id:{
                    type: String,
                    required: true,
                    unique: true
                },
                title:{
                    type: String,
                    required: true
                },
                time: Number,
                blocks: Object,
                version: String
            },
            sharedWithUser:{
                _id: {
                    type: String,
                    required: true,
                    unique: true
                },
                title:{
                    type: String,
                    required: true
                },
                author:{
                    type: String,
                    required: true
                },
                role:{
                    type: Number,
                    required: true
                },
                localPath:{
                    type: String,
                    required: true
                }
            }
        },
        sharedFiles:{
            _id:{        //TODO decidere semantica ID
                type: String,
                required: true,
                unique: true
            },
            title:{
                type: String,
                required: true
            },
            author:{
                type: String,
                required: true
            },
            time: Number,
            blocks: Object,
            version: String,
            alreadyOpen: {
                type: Boolean,
                required: true
            },
            sharedGroup: {
                email: {
                    type: String,
                    required: true,
                },
                role: {
                    type: Number,
                    required: true,
                }
            }
        }
    })

    vordSchema.pre("save", function(next) {
        let schema = this
        bcrypt.hash(schema.users.password, conf.passwordSalt, function(err, hash) {
            if (err) {
                return next(err)
            }
            schema.users.password = hash
            next()
        })
    })

    module.exports = mongoose.model('DB', vordSchema)