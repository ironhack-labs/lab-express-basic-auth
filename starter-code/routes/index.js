const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.post('/', (req, res, next) => {
  const genericUserInstance = new User();

  const saltRounds = 5;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(req.body.password, salt);

  genericUserInstance.password = hash;
  genericUserInstance.user = req.body.user;

  genericUserInstance.save();

  console.log(genericUserInstance);
});


module.exports = router;
