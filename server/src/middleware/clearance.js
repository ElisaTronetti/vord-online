const SharedDocuments = require('../models/sharedDocumentsModel')
const ObjectId = require('mongoose').Types.ObjectId

module.exports = function (requiredClearance) {
  return async function (req, res, next) {
    const documentId = req.body.documentId || req.headers["documentId"]
    if(!documentId) {
      res.status(403).send("Document id not found");
    } else {
      const userId = req.body.user._id || req.headers["userId"]
      if(!userId) {
        res.status(403).send("User id not found");
      } else {
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
          res.status(401).send("Operation forbidden: the user does not possess the requisites to perform the action.");
        }               
      }    
    }
  }
}