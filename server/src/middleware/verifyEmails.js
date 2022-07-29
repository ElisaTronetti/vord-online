const Responses = require("../controllers/responses/response")
const Users = require("../models/userModel")

const verifyEmails = async (req, res, next) => {
  const sharedWith = req.body.sharedWith

  if (sharedWith === undefined) {
    return res.status(403).send("sharedWith array not found");  //sharedWith doesn't exist (bad request)
  }
  try {
    let i = 0, result
    while(sharedWith[i] !== undefined){
      //sharedWith[i] doesn't have an email field (bad request)
      if(sharedWith[i].email === undefined) { return res.status(403).send("Missing parameter: sharedWith["+i+"].email") }  

      //check if the email corresponds to a registered user
      result = await Users.exists({email: sharedWith[i].email})
      
      if(!result) { return res.status(404).send("User not found: " + sharedWith[i].email) }   //if the email doesn't exist in the database, return error
      
      i++
    }

    //if every mail exists in the databse the computation can continue
    return next()
    
  } catch (err) {
    return Responses.ServerError(res, {message: err.message});
  }
};

module.exports = verifyEmails;