let express = require('express');
const morgan = require('morgan');
let router = express.Router();
const User           = require("../models/user");
// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

/* GET home page. */
router.get('/signup', function(req, res, next) {
  console.log("Hola, estoy en signup GET");
  res.render('auth/signup', { title: 'signup' });
});

router.post("/signup", (req, res, next) => {
  console.log("HOLAAA ESTOY EN SIGNUP POST!!");
  let username = req.body.username;
  let password = req.body.password;
  let salt     = bcrypt.genSaltSync(bcryptSalt);
  let hashPass = bcrypt.hashSync(password, salt);

  let newUser  = User({
    username: username,
    password: hashPass
  });

  newUser.save((err, usr) => {
    if (err) {
      console.log("OYEEE QUE ME HE EQUIVOCADO EN ESTO");
      console.log(err);
    } else {
      console.log(usr);
      res.redirect("/users/signup", {
        msg: "Usuario creado con éxito"
      });
    }
  });
});

module.exports = router;
