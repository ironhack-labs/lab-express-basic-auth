/*jshint esversion: 6 */

const express = require('express');
const router = express.Router();
const User = require("../models/user");

/* GET home page. */

router.get('/', (req, res, next) => {
  res.render('sign-up/index');
});

router.post('/', (req, res, next) => {
    const newUser = User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    });


});

module.exports = router;
