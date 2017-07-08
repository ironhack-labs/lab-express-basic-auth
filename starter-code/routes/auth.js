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
  res.render('auth/signup', {
    title: 'signup'
  });
});

router.post("/signup", (req, res, next) => {
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
      return res.render('auth/signup',
        withTitle({
          errorMessage: "The username already exists"
        }));
    }

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
  User.findOne({
    "username": username
  }, (err, user) => {
    if (user === null) {
      return res.render("auth/login", withTitle({
        errorMessage: "El usuario no existe"
      }, 'Login Formulario'));
    }
    if (err) {
      return res.render("auth/login", withTitle({
        errorMessage: err
      }, 'Login Formulario'));
    } else {
      if (bcrypt.compareSync(password, user.password)) {
        return res.redirect("/auth/login");
      } else {
        return res.render("auth/login", withTitle({
          errorMessage: "Oye tio, pon bien el password"
        }, 'Login Formulario'));
      }
    }
  });

});

module.exports = router;
