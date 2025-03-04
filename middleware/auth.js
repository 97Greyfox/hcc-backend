const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next)=>{
  const auth = req.headers['authorization'];
  console.log(auth);
  if(!auth){
    return res.status(401).json({message: "unauthorized JWT required"});
  }
  try {
    const decoded = jwt.verify(auth, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({message: "unauthorized"});
  }
}

module.exports = {ensureAuthenticated};