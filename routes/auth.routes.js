const express = require(`express`);
const router = express.Router();

const mongoose = require(`mongoose`);

const bcryptjs = require(`bcryptjs`);

const User = require(`../models/User.model`);

const saltRounds = 10;

router.get(`/signup`, (req,res,next) => {
    res.render(`sign-up`);
});


router.post(`/entered`, (req,res,next) => {
    const { username, userPassword } = req.body;

    bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(userPassword, salt))
    .then((hashedPassword) => {
        console.log(hashedPassword)
        return User.create({username, password: hashedPassword })
    })
    .then((usersDB) => {
        console.log(usersDB);
    })
    .catch(err => {
        console.log(`error due to ${err}`);
    });
});





module.exports = router;



