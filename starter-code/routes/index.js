const express = require('express');
const router  = express.Router();
const Users = require("../models/User");
const bcrypt  = require('bcrypt')



// Signin route
router.get('/', (req, res, next) => {
  res.render('signup');
});


// Signin write
router.post("/", (req, res) => {
  const saltRounds = 10;
  const plainPassword1 = req.body.password;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(plainPassword1, salt);

  Users.findOne({ name: req.body.username }).then(userFound => {
    if (userFound !== null) {
      res.json({ authorised: false, reason: "User exists" });
    } else {
      Users.create({ username: req.body.username, password: hash })
        .then(userCreated => {
          res.json({ created: true, userCreated });
        })
        .catch(() => {
          res.json({ created: false });
        });
    }
  });
});



module.exports = router;
