const express = require('express');
const router = express.Router();
const User = require("../models/User");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.post('/', (req, res, next) => {
  // const saltRounds = 10;
  // const plainPassword1 = req.body.password;
  // const salt = bcrypt.genSaltSync(saltRounds);
  // const hash = bcrypt.hashSync(plainPassword1, salt);


  User.create({
      name: req.body.username,
      password: req.body.password
    })
    .then(userCreated => {
      res.json({
        created: true,
        userCreated
      });
    })
    .catch(() => {
      res.json({
        created: false
      });
    });

});


module.exports = router;