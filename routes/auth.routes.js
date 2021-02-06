const express = require("express");
const router = express.Router();
//const bcrypt = require('bcrypt');
const bcryptjs = require(`bcryptjs`);
const User = require("../models/User.model.js")

router.get('/signup', (req, res, next) =>
    res.render('login/signup'));

const saltRounds = 10


router.post(`/signup`, (req, res, next) => {
    const { username, Userpassword } = req.body;
    console.log(username)
    bcryptjs
        .genSalt(saltRounds)
        .then((salt) => bcryptjs.hash(Userpassword, salt))
        .then((hashedPassword) => {
            console.log("hola", hashedPassword)
            return User.create({ username, password: hashedPassword })
        })
        .then((usersDB) => {
            console.log(usersDB);
        })
        .catch(err => {
            console.log(`error due to ${err}`);
        });
});

module.exports = router


