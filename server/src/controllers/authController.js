require("dotenv").config();

const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')

const Users = require('../models/userModel')
const UserFactory = require('../models/factories/user')
const Responces = require('./responces/responce')


async function signup(req, res) {
    let newUser = UserFactory.createUser(req.body.email, req.body.name, req.body.surname, req.body.password);
    await Users.findOne({email: newUser["username"]}).then(async profile => {
        if(!profile) {
            newUser.save().then(() => {
                Users.find({email: newUser.email}).select('_id email token').then(user => {
                    const email = user.email;
                    // Create token
                    const token = jwt.sign(
                        { user_id: user._id, email },
                        process.env.TOKEN_KEY,
                        {
                          algorithm: "HS512", 
                          expiresIn: 3
                        }
                      );
                    // save user token
                    user.token = token;
                })
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
    try {
      // Get user input
      const { email, password } = req.body;
  
      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const user = await Users.findOne({ email });
  
      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            algorithm: "HS512", 
            expiresIn: '2h'
          }
        );
  
        // save user token
        user.token = token;
  
        // user
        res.status(200).json(user);
      } else {
        res.status(400).send("Invalid Credentials");
      }
    } catch (err) {
      console.log(err);
    }
}

module.exports = {
    signup,
    login
}