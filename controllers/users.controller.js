const User = require("../models/User.model");
const mongoose = require("mongoose");

module.exports.login = (req, res, next) => {
  res.render("users/login");
};

module.exports.loginPost = (req, res, next) => {
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


module.exports.signup = (req, res, next) => {
  res.render("users/signup");
};


module.exports.create = (req, res, next) => {
  const user = new User(req.body);
  //guardar el usuario en la base de datos
  user
    .save()
    .then(() => {
      res.redirect("/login");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.render("users/signup", { error: error.errors, user });
      } else if (error.code === 11000) { // error when duplicated user
        res.render("users/signup", {
          user,
          error: {
            email: {
              message: 'user already exists'
            }
          }
        });
      } else {
        next(error);
      }
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

