var express = require('express');
var router = express.Router();

// User model
const User           = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'i am the index of authenticate!' });
});




module.exports = router;

