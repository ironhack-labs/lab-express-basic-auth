const mongoose = require("mongoose");
const User = require("../models/User.model");

module.exports.register = (req, res, next) => {
  res.render("users/register");
};

module.exports.doRegister = (req, res, next) => {
  const { username, email, password } = req.body;

  User.findOne({ email })
    .then((dbUser) => {
      if (dbUser) {
        res.render("users/register", {
          user: {
            email,
            username,
          },
          errors: {
            email: "Email is already registered!",
          },
        });
      } else {
        User.create({
          username,
          email,
          password,
        }); 
        res.redirect("/login")
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

module.exports.login = (req, res, next) => {
  res.render('users/login', { errors: false});
}; 

module.exports.dologin = (req, res, next) => {
  const { email, password } = req.body;

  const renderWithErrors = (msg) => {
    res.render('users/login', {
      email, 
      errors: {
        msg: msg || 'Email or password are incorrect'
      }, 
    });
  }; 

  if (!email || !password) {
    renderWithErrors();
  } else {
    User.findOne({email}) 
     .then((dbUser) => {
      if (!dbUser) {
        renderWithErrors();
      } else {
        res.redirect('/profile');
      }
     })
     .catch((err) => next(err));
  }
}