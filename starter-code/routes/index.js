const express = require('express');
const User = require('../models/User');

const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.post('/', (req, res, next) => {
  const userName = req.body.user;
  const password = req.body.password;
  console.log(userName);
  console.log(password);
});


module.exports = router;
