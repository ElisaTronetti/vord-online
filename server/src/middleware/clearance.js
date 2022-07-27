const SharedDocuments = require('../models/sharedDocumentsModel')
const ObjectId = require('mongoose').Types.ObjectId

const verifyLevel = (req, res, next, requiredClearance) => {
  const documentId = req.body.documentId || req.headers["documentId"]
  if(!documentId) {
    return res.status(403).send("Document id not found");
  }

  const userId = req.body.user._id || req.headers["userId"]
  if(!userId) {
    return res.status(403).send("User id not found");
  }

  try{
    const sharedDocument = await SharedDocuments
                                .findById(new ObjectId(documentId))
                                .select({ sharedGroup: {$elemMatch: {_id: new ObjectId(userId)}}})
    
    const role = sharedDocument.sharedGroup[0].role

    if(!role || role < requiredClearance){
      return res.status(401).send("Operation forbidden: the user does not possess the requisites to perform the action.");
    } else {
      return next();
    }
        
  } catch (err) {
    return res.status(401).send("Operation forbidden: the user does not possess the requisites to perform the action.");
  }                            
};

module.exports = verifyLevel;