let express = require('express');
const morgan = require('morgan');
let router = express.Router();
const User = require("../models/user");
// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

function withTitle(c, title) {
  c.title = title || 'Titulo no definido';
  return c;
}

/* GET home page. */
router.get('/signup', function(req, res, next) {
  console.log("Hola, estoy en signup GET");
  res.render('auth/signup', {
    title: 'signup'
  });
});

router.post("/signup", (req, res, next) => {
  console.log("Heeeyyyy estoy entrando en POST!!");
  if (req.body.username === "" || req.body.password === "") {
    return res.render('auth/signup',
      withTitle({
        errorMessage: "Indicate a username and a password to sign up"
      }));
  }

  User.findOne({
    "username": req.body.username
  }, "username", (err, user) => {
    if (user !== null) {
      console.log("EL usuario existe");
      return res.render('auth/signup',
        withTitle({
          errorMessage: "The username already exists"
        }));
    }

    console.log("HOLAAA ESTOY EN SIGNUP POST!!");
    let username = req.body.username;
    let password = req.body.password;
    let salt = bcrypt.genSaltSync(bcryptSalt);
    let hashPass = bcrypt.hashSync(password, salt);

    let newUser = User({
      username: username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("signup", withTitle({
          errorMessage: "Something went wrong"
        }));
      } else {
        console.log("OK");
        res.redirect("/");
      }
    });
  });
});

/* GET auth route login form */
router.get('/login', function(req, res, next) {
  res.render('auth/login', withTitle({}, 'Login Formulario'));
});

/* GET auth route login form */
router.post('/login', function(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;

  if (username === "" || password === "") {
    return res.render("auth/login", withTitle({
      errorMessage: "Indicate a username and a password to sign up"
    }, 'Login Formulario'));
  }
  console.log("Imprimo USER");
  console.log(username);
  console.log("Ahora imprimo el user directo");
  console.log(username.username);

  User.findOne({
    "username": username
  }, (err, user) => {
    console.log("IMPRIMO USER DENTRO DE FINDONE");
    console.log(user.username);
    if (user === null) {


      if (err) {
        console.log("Eeyyy que doy error al comprobar el user");
        return res.render("auth/login", withTitle({
          errorMessage: err
        }, 'Login Formulario'));
      } else {
        console.log(user);
        // Comprobamos que el hash del password del objeto
        //  user sea igual al hash que recibo en el POST
        if (bcrypt.compareSync(password, user.password)) {
          // BIEN! El password es correcto
          console.log("Password correcto");
          return res.redirect("/auth/login");
        } else {
          console.log("Password incorrecto");
          return res.render("auth/login", withTitle({
            errorMessage: "Oye tio, pon bien el password"
          }, 'Login Formulario'));
        }
      }
    } else {
      console.log("USUARIO NO EXISTE");
    }
  });

});

module.exports = router;
