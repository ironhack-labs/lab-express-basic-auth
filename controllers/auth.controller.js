const mongoose = require('mongoose');
const User = require("../models/User.model");
const bcrypt = require("bcrypt");

module.exports.index = (req, res, next) => {
  User.find()
  .then((users) => {
    res.render("index", { users });
  })
  .catch((e) => next(e))
};

module.exports.create = (req, res, next) => {
  res.render("signup");
};

module.exports.doCreate = (req, res, next) => {
  User.create(req.body)
  .then(() => {
    res.redirect("/");
  })
  .catch((e) => {
    if (e instanceof mongoose.Error.ValidationError) {
      res.render('register', {
        errors: e.errors,
        user: {
          email: req.body.email
        }
      })
    } else if (e.code === 11000) {
      res.render('register', {
        errors: { email: 'There is already an account registered with this email' },
        user: {
          email: req.body.email
        }
      })
    } else {
      next(e)
    }
  })
}


module.exports.login = (req, res, next) => {
  res.render("login");
};

module.exports.doLogin = (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({username})
    .then((user) => {
        const isValid = bcrypt.compareSync(password, user.password)
        if(isValid) {
          req.session.currentUser = user
          res.redirect('/profile')
        } else{
            res.render('login', {
              errorMessage: 'Username or password are invalid',
              user: {
                username
              }
            })
        }
    })
    .catch(e => next(e))
}


module.exports.profile = (req, res, next) => {
  res.render('profile')
}

module.exports.logout = (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
}
