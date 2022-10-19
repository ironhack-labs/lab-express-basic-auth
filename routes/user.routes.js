const express = require('express');
const router = express.Router();
const User = require('../models/User.model.js');
const bcryptjs = require('bcryptjs');

router.get("/signup", (req, res, next) => {
    res.render("auth/signup.hbs");
  });

  


module.exports = router;