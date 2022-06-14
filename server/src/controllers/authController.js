const dbModel = require('../models/userModel')
const UserFactory = require('../models/factories/user')
const Responces = require('../controllers/responces/respoce')

async function signup(req, res) {
    let newUser = UserFactory.createUser(req.body.email, req.body.name, req.body.surname, req.body.password);
    await dbModel.findOne({email: newUser["username"]}).then(async profile => {
        if(!profile) {
            newUser.save().then(() => {
                Responces.OkResponce(res, newUser);
            }).catch(err => {
                Responces.ServerError(res, {message: err.stack});
            })
        } else {
            Responces.ConflictError(res, {message: "User with the same email already exists."});
        }
    }).catch(err => {
        Responces.ServerError(res, {message: err.message});
    })
}

async function login(req, res) {
    //TODO
}

module.exports = {
    signup,
    login
}