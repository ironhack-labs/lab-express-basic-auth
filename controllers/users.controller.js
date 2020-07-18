const User = require("../models/User.model");
const mongoose = require("mongoose");

module.exports.login = (req, res, next) => {
  res.render("users/login");
};

module.exports.loginPost = (req, res, next) => {
  console.log('estas ejecutando esto GALLA')
  User.findOne({ username: req.body.username })
    .then(user => {
      if (user) {
        user.checkPassword(req.body.password)
          .then(match => {
            if (match) {
              req.session.userId = user._id
              res.redirect('/user-hello')
            } else {
              res.render('users/login', {
                error: {
                  username: {
                    message: 'user not found'
                  }
                }
              })
            }
          })
      } else {
        res.render("users/login", {
          error: {
            username: {
              message: "user not found",
            },
          },
        });
      }
    })
    .catch(next)
}


module.exports.signup = (_, res) => {
  res.render('users/signup', { user: new User() }) //llamar a la clase new User
}


module.exports.create = (req, res, next) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  //guardar el usuario en la base de datos
  user
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((error) => {
      console.log(error)
      res.render('users/signup', { error: error.errors, user })
    })
    .catch(next)
}

module.exports.userHello = (req, res, next) => {
  res.render('users/user-hello')
}

module.exports.logout = (req, res, next) => {
  req.session.destroy()

  res.redirect('/login')
}

