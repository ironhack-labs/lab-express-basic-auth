const express = require("express");
const router = express.Router();

const User = require("../models/User.model");

const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

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
        .then(() => {
          res.redirect("/");
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      //Pasa a la siguiente llamada que tenga en linea
      next(error);
    });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  if (username ==="" || password ==="") {
      res.render('auth/login', {
          errorMessage: 'Please enter both, username and password to log in.'
      });
      return;
  }
  User.findOne({username:username})
  .then((user) => {
      if (!user) {
          res.render('auth/login', {
              errorMessage:"The username doesn't exist."
          });
          return;
      }
      if (bcrypt.compareSync(password, user.password)) {
          req.session.currentUser = user;
        //  Porque no funciona?¿
          //res.locals.currentUser = req.sessions,currentUser
          const userName = req.session.currentUser.username;
          //Se puede mostrar datos del usuario en el home, poner la view dnd se quiere ir.
       
          res.render('home', {userName});
          res.redirect('/');
      }else{
          res.render('auth/login', {
              errorMessage:'Incorrect password'
          })
      }
  })
  .catch((error)=>{
      next(error);
  })
});

module.exports = router;
