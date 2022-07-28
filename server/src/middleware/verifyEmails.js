const verifyEmails = async (req, res, next) => {
  if (!sharedWith) {
    return res.status(403).send("sharedWith array not found");
  }
  try {
    let i = 0, result
    while(!sharedWith[i]){
      if(!sharedWith[i].email) { return res.status(403).send("Missing parameter: sharedWith["+i+"].email") }
      result = await Users.findOne({email: sharedWith[i].email})
      if(!result) {return res.status(404).send("User not found: "+sharedWith[i].email)}
    }
    return next()
  } catch (err) {
    return res.status(403).send("Invalid user");
  }
};

module.exports = verifyEmails;