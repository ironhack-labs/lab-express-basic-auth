const jwt = require('jsonwebtoken');

// authenticate access to protected routes
module.exports = function (req, res, next) {
  // grab token from header
  const token = req.header('x-auth-token');

  // check if token exists
  if (!token) {
    return res.status(401).json({ msg: { error: 'No token. Authorization deined.'} });
  }

  // verify and decode token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // grab 'user' object with 'id' from decoded object
    req.user = decoded.user;

    next();
  } catch (error) {
    res.status(401).json({ msg: { error: 'Token is not valid.' } });
  }
};
