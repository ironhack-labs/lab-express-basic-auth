const express = require('express');
const router  = express.Router();
const bcrypt = require("bcrypt");
const Users = require("../models/user");
/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
