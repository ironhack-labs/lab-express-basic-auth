const express = require("express");
const router = express.Router();

router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});

// User model
const User = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    // Aquí es donde ponemos todos los chequeos para asegurarnos de que el usuario/pass cumplen los requisitos 
    // Podemos crear más IF para asegurar que el user sea un mail, que el pass tenga símbolos... etc etc
    if (username === "" || password === "") {
        res.render("auth/signup", {
          errorMessage: "Indicate a username and a password to sign up"
        });
        return;
      }

      // Por si las flys chequeamos que el usuario no existe y todo eso
      User.findOne({ "username": username })
      .then(user => {
        if (user !== null) {
            res.render("auth/signup", {
              errorMessage: "The username already exists!"
            });
            return;
          }
      
          const salt     = bcrypt.genSaltSync(bcryptSalt);
          const hashPass = bcrypt.hashSync(password, salt);
      
          User.create({
            username,
            password: hashPass
          })
          .then(() => {
            res.redirect("/");
          })
          .catch(error => {
            console.log(error);
          })
      })
      .catch(error => {
        next(error);
      })
});



module.exports = router;