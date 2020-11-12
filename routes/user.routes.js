const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
const {
    Router
} = require("express");
const User = require("../models/User.model");

const router = new Router();
const saltRounds = 10;

router.get('/sign-up', (req, res, next) => res.render('auth/signup'));

module.exports = router;
