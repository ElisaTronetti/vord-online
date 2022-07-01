const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    token: String,
    documents: [{            //documents of the user
        title: String,
        time: Number,
        blocks: Object,
        version: String
    }],
    sharedWithUser:[{
        title: String,
        author: String,
        role: Number,
        localPath: String
    }]
})

//hash password before saving it in the db
UserSchema.pre("save", function (next) {
    let user = this
    bcrypt.hash(user.password, process.env.PASSWORD_SALT || 10, function (err, hash) {
        if (err) {
            return next(err)
        }
        user.password = hash
        next()
    })
})

module.exports = mongoose.model('User', UserSchema)