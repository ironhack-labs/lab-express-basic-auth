const express = require("express");
const router = express.Router();

const User = require("../models/User");

const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  // aca creo la const para traer del body del form los campos username y password
  const { username, password } = req.body;

  // escribo las validaciones

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "The username already exists",
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({ username, password: hashPass })

        //aca en el then, una vez creado el usr lo que hago es que me redireccione a la home
        .then(() => {
          res.redirect("/");
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
