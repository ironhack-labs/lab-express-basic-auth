const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const {
    Router
} = require("express");
const User = require("../models/User.model");

const router = new Router();
const saltRounds = 10;

router.get('/sign-up', (req, res, next) => res.render('auth/signup'));

// router.post('/sign-up', (res, req, next) => {
//     const {
//         username,
//         passwordHash
//     } = req.body
// })


module.exports = router;