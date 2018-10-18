const express = require('express');
const router = express.Router();
const User = require ("../models/User");
const bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('signup');
});

router.post("/", function(req, res, next){
  const {username, password} = req.body;
  if (!username || ! password) {
    return res.redirect("signup")
  }
  User.findOne({username})
  .then(user => {
    if (user) {
      res.redirect("signup")
    } else {
      const salt  = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
      User.create({'username': username, 'password': hashedPassword})
      .then((newUser) => {
        req.session.user = newUser;
        res.redirect("profile")
      })
      .catch(next)
    }
  })
})

module.exports = router;
