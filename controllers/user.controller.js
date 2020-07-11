const User = require('../models/user.model');

module.exports.index = (req, res) => {
  res.render('index');
};

module.exports.login = (req, res) => {
  res.render('login');
};
module.exports.signup = (req, res) => {
  res.render('users/signup');
};

module.exports.createUser = (req, res) => {
  const newUser = new User(req.body);

  newUser.save()
    .then(user => {
      res.render('users/profile', {
        user
      })
    })
    .catch((error) => {
      console.log('error', error);
      res.render('error', {
        error,
        user: req.body
      })
    });
}