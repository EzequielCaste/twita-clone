const jwt = require('jsonwebtoken');

//Middleware
module.exports = function (req, res, next){
  const token = req.session.authToken;
  
  if(!token) return res.status(401).send('Access Denied');

  try{
    //verify gets the user ID
    const verified = jwt.verify(token, process.env.TOKEN_SECRET)
    req.user = verified;
    next();
  }catch(err){
    res.status(400).send('Invalid Token')
  }
};