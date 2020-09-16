const bcrypt = require('bcryptjs');
const saltRounds = 10;
const express = require('express');
const router = express.Router();

const User = require('../models/User.model');

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

//GET:

router.get('/signup', (req, res) => {
    res.render('auth/signup');
});

//POST:

router.post('/signup', async (req, res) => {
    console.log(req.body);

    try {
        const {username, password} = req.body;

        const salt = await bcrypt.genSalt(saltRounds);
        const hashPass = await bcrypt.hash(password, salt);
        console.log('hashpass =>', hashPass);

        const result = await User.create({username, passwordHash: hashPass});

        res.redirect('/signup');
        console.log(result);

    } catch (err) {
        console.error(err);
    }
});

module.exports = router;
