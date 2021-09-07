const router = require("express").Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res, next) => {
  res.render("signup");
});


module.exports = router;