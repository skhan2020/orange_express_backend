const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  // here we check if the header has authentication 
  // and if no then just isAuth as false and call move
  // on with the request
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(' ')[1]; // Authorization : Bearer <jwtoken>
  
  if (!token || token === null) {
    req.isAuth = false;
    return next();
  }
  let decodedToken;
  try { 
    decodedToken = jwt.verify(token, 'somesupersecretkey');
  }
  catch(err) {
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  // adds this information to the request
  // and passes it on to the next call
  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
}