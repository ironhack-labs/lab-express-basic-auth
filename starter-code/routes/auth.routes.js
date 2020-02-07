const express = require("express");
const router = express.Router();

const User = require("../models/user.model");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/signup", (req, res) => res.render("auth/signup"));
router.post("/signup", (req, res) => {
  const { email, password } = req.body;

  if (email.length === 0 || password.length === 0) {
    res.render("auth/signup", {
      errorMessage: "Rellena los campos"
    });
    return;
  }

  User.findOne({
    email: email
  })
    .then(actualUser => {
      if (!actualUser) {
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        User.create({
          email,
          password: hashPass
        })
          .then(newUser => res.redirect("/"))
          .catch(err => console.log("Error al crear usuario", err));
      } else {
        res.render("auth/signup", {
          errorMessage: "Email ya registrado"
        });
        return;
      }
    })
    .catch(err => console.log("Error al buscar el usuario en la BBDD", err));
});

router.get("/login", (req, res) => res.render("auth/login"));
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.render("auth/login", { errorMessage: "Rellena los campos" });
    return;
  }

  User.findOne({ email: email })
    .then(theUserFound => {
      if (!theUserFound) {
        res.render("auth/login", { errorMessage: "Email no registrado" });
        return;
      }

      if (bcrypt.compareSync(password, theUserFound.password)) {
        req.session.currentUser = theUserFound;
        res.redirect("/");
      } else {
        res.render("auth/login", { errorMessage: "Contraseña incorrecta" });
      }
    })
    .catch(err => console.log(err));
});

module.exports = router;
