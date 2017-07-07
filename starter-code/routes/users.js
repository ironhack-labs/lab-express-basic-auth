let express = require('express');
let router = express.Router();
const User           = require("../models/user");
// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt-pbkdf");
const bcryptSalt     = 10;

/* GET home page. */
router.get('/signup', function(req, res, next) {
  res.render('auth/signup', { title: 'signup' });
});

authRoutes.post("/signup", (req, res, next) => {
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
      res.redirect("/");
    }
  });
});

module.exports = router;
