const SharedDocuments = require('../models/sharedDocumentsModel')
const ObjectId = require('mongoose').Types.ObjectId
const Responses = require("../controllers/responses/response")

module.exports = function (requiredClearance) {
  return async function (req, res, next) {

    //get document id
    const documentId = req.body.documentId || req.headers["documentid"]
    if(!documentId) {
      res.status(403).send("Document id not found");
    } else {
      //get user id (long way because simple notation doesn't work with complex body objects)
      const user = req.body.user
      let userId = undefined
      if(!user){
        userId = req.headers["userid"]
      } else {
        userId = req.body.user._id
      }
      if(!userId) {
        res.status(403).send("User id not found");
      } else {
        //check if the user is authorized comparing its role in the sharedGroup (if there is anyone) with the role requested to perform the operation
        try{
          const sharedDocument = await SharedDocuments
                                      .findById(new ObjectId(documentId))
                                      .select({ sharedGroup: {$elemMatch: {_id: new ObjectId(userId)}}})
          
          const role = sharedDocument.sharedGroup[0].role
          if(!role || role < requiredClearance){
            res.status(401).send("Operation forbidden: the user does not possess the requisites to perform the action.");
          } else {
            next();
          }      
        } catch (err) {
          return Responses.ServerError(res, {message: err.message});
        }               
      }    
    }
  }
}