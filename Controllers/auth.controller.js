const User = require("../models/User.model");
const mongoose = require("mongoose");

// signup 
module.exports.signup = (req, res, next) => {
  res.render("auth/signup"); // Correct path FINALLYYYYYY 
};


// doSignup
module.exports.doSignup = (req, res, next) => {
  User.create(req.body)
    .then((user) => {
      res.redirect("/login");
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        // Handle validation errors
        res.render("auth/signup", {
          user: {
            email: req.body.email,
          },
          errors: err.errors,
        });
      } else if (err.code === 11000) {
        // Handle duplicate key error
        res.render("auth/signup", {
          user: {
            email: req.body.email,
          },
          errors:{
            password:"This email is already registered. Please use a different one."
          } 
          
        });
      } else {
        // Handle any other errors
        next(err);
      }
    });
  }


// Render login form
module.exports.login = (req, res, next) => {
  res.render("auth/login"); // Correct view path
};

// Handle login submission
module.exports.doLogin = (req, res, next) => {
  const { email, password } = req.body;

  const renderWithErrors = () => {
    res.render("auth/login", {
      email,
      error: "Email o contraseña incorrectos", // Incorrect email or password
    });
  };

// The juicy part we did in class
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return user.checkPassword(password).then((match) => {
          if (match) {
            req.session.userId = user.id; // Save user ID in session (cookie magic!)
            res.redirect("/profile");
          } else {
            console.log("Contraseña incorrecta");
            renderWithErrors();
          }
        });
      } else {
        console.log("No existe usuario con ese email");
        renderWithErrors();
      }
    })
    .catch((err) => next(err));
};

// How you logout
module.exports.logout = (req, res, next) => {
  req.session.destroy();
  res.clearCookie("express-cookie");
  res.redirect("/login");
};


// Add the main 


// Add the private 