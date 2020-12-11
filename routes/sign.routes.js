const { Router } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
//const{} = require("../Controllers/user.controllers");
const saltRounds = 10;

const router = new Router();

router.get("/signup", (req, res) => res.render("auth/signup"));
router.get("/userProfile", (req, res) => res.render("users/user-profile"));
router.post("/signup", (req, res, next) => {
  const { username, email, password } = req.body;

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hash) => {
      console.log("la hash es :", hash);
      //Crear Ususario en base de datos
      User.create({
        username: username,
        email: email,
        password: hash,
      }).then((data) => {
        console.log("Usuario Creado, Info:", data);
        res.redirect("/userProfile");
      });
    })
    .catch((err) => next(err));
});

module.exports = router;
