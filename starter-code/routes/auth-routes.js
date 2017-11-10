const express = require("express");
const authRoutes = express.Router();
// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
// User model
const User           = require("../models/user");

authRoutes.get("/signup", (req, res, next) => {
  res.render('auth/signup')
});

authRoutes.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
  //validar que el user no existe, conectandose a la base de datos
  User.findOne({ "username": username },
  "username",
  (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }

    var salt     = bcrypt.genSaltSync(bcryptSalt); //numero de veces que vas encriptar
    var hashPass = bcrypt.hashSync(password, salt);//guardar la contrasena ya encriptada

    var newUser = User({
      username,
      password: hashPass
    });


    newUser.save((err) => {
      res.redirect("/");
    });
  });
});


module.exports = authRoutes;
