const User = require('../models/user');

function requireFields (req, res, next) {
  const user = req.body;
  
  if (!user.username || !user.password) {
    return res.render('users/signup', {error: 'Username or password can not be empty.'});
  } else {
    next();
  }
}

function userExists (req, res, next) {
  const user = req.body;

  User.findOne({username: user.username})
      .then(user => {
        if(user) {
          return res.render('users/signup', {error: 'Username already taken.'});
        } else {
          next();
        }
      })
}

module.exports = {
  requireFields,
  userExists
}