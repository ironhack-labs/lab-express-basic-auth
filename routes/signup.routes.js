const express = require('express');
const router = express.Router();

const User = require('../models/User.model');

const bcryptjs = require('bcryptjs');
const saltRound = 10;

router.get('/', (req, res, next) => res.render('signup'));

router.post('/', (req, res, next) => {
    const { username, password } = req.body;
    bcryptjs.genSalt(saltRound)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            return User.create({
                username,
                passwordHash: hashedPassword
            });
        })
        .then(userFromDB => {
            res.send(`${userFromDB.username} has been created`);
        })
        .catch(err => next(err));
});

module.exports = router;
