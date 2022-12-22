const jwt = require('jsonwebtoken');

const protectRoute = (req, res, next) => {
  // Get token from req header
  let token = req.headers?.["x-access-token"];

  if (!token) return res.status(401).send();

  if(token.includes('Bearer ')) {
    token = token.split(' ')[1];
    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).send(err);

      // Add token payload to req.user
      req.user = {
        id: decoded.id,
        username: decoded.username,
      }

      next();
    })
  } else {
    return res.status(401).send();
  }
}

module.exports = protectRoute;