const mongoose = require('mongoose');
const User = require('../models/User.model');

//SIGN UP 
module.exports.signUp = (req, res, next) => {
    res.render('auth/sign-up');
};

//DO SIGN UP
module.exports.doSignUp = (req, res, next) => {
    const user = req.body;

    User.findOne({ email: user.email })
    .then((userFound) => {
      if (userFound){
            res.render("auth/sign-up", {
                user,
                errors: {
                    emailExist: "This e-mail already exist",
                }          
            });  
      } else {
        return User.create(user)
        .then((user) => {
          const id = user.id
          res.redirect(`/profile/${id}`);
        })
      }
    })    
    .catch((err) => {
      console.log("errors", err);
      res.render("auth/sign-up", {
        user,
        errors: err.errors,
      });
      next(err);
    });
}

//LOG IN
module.exports.login = (req, res, next) => {
  res.render('auth/log-in')
}

//DO LOGIN
module.exports.doLogin = (req, res, next) => {
  console.log("SESSION =====> ", req.session);

  const user = req.body;
  const { email, password } = req.body;

  User.findOne({ email })
  .then((userFound) => {
    if (!userFound){
      res.render("auth/log-in", {
        user,
        errors: {
          email: "Invalid credentials",
        }          
      });
    } else if (userFound) {
      userFound.checkPassword(password)
      .then((match) => {
          if (match) {
            req.session.currentUser = userFound;
            res.redirect(`/profile/${userFound.id}`)
          } else {
            res.render("auth/log-in", {
                user,
                errors: {
                  password: "Invalid credentials",
                }          
            });
          }
      })           
    } 
  })
  .catch((err) => {
      console.log("errors", err);
      res.render("auth/log-in", {
        user,
        errors: err.errors,
      });
      next(err);
  });  
}

//LOG OUT
module.exports.logout = (req, res, next) => {
  req.session.destroy();
  res.redirect("/login");
}