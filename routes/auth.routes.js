const { Router } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
//const{} = require("../Controllers/user.controllers");
const saltRounds = 10;
const mongoose = require("mongoose");

const router = new Router();

//// SIGNUP/////

router.get("/signup", (req, res) => res.render("auth/signup"));
router.get("/userProfile", (req, res) => res.render("users/user-profile",{userInSession:req.session.currentUser}));
router.post("/signup", (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.render("auth/signup", {
      errorMessage:
        "Todos los campos son obligatorios, complete su username, email y password",
    });
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render("auth/signup", {
      errorMessage:
        "El password necesita al menos 6 caracteres y debe contener letra minuscula, mayuscula y un numero al menos",
    });
    return;
  }

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
      })
        .then((data) => {
          console.log("Usuario Creado, Info:", data);
          req.session.currentUser = data
          res.redirect("/userProfile");
        })
        .catch((error) => {
          if (error instanceof mongoose.Error.ValidationError) {
            res
              .status(500)
              .render("auth/signup", { errorMessage: error.message });
          } else if (error.code === 11000) {
            res.status(500).render("auth/signup", {
              errorMessage:
                "Nombre de usuario y email deben ser unicos, los datos anteriores ya estan en uso",
            });
          } else {
            next(error);
          }
        });
    })
    .catch((err) => next(err));
});

///////////////////////////LOGIN//////////////////////////

router.get("/login", (req, res) => res.render("auth/login"));

router.post("/login", (req, res, next) => {
  //console.log('SESSION =====> ', req.session);
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "Email no registrado. intentelo de nuevo.",
        });
        return;
      } else if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/userProfile');
      } else {
        res.render("auth/login", { errorMessage: "Password Incorrecto." });
      }
    })
    .catch((error) => next(error));
});

////////////////// LOGOUT ///////////////////

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});


router.get("/userProfile", (req, res) => {
  // console.log('your sess exp: ', req.session.cookie.expires);
  res.render("users/user-profile", { userInSession: req.session.currentUser });
});

module.exports = router;
