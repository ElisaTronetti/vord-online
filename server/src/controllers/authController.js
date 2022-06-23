const dbModel = require('../models/userModel')
const UserFactory = require('../models/factories/user')
const Responces = require('./responces/responce')
const bcrypt = require('bcryptjs')

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
    const body = req.body;
    const user = await dbModel.findOne({ email: body.email });
    if (user) {
      // check user password with hashed password stored in the database
      const validPassword = await bcrypt.compare(body.password, user.password);
      if (validPassword) {
        res.status(200).json({ message: "Valid password" });
      } else {
        res.status(400).json({ error: "Invalid Password" });
      }
    } else {
      res.status(401).json({ error: "User does not exist" });
    }
}

module.exports = {
    signup,
    login
}