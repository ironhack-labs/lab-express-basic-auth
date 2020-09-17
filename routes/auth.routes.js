const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');

const validate = require('../utils/dataValidate');
const pwdEncrypt = require('../utils/passwdManager');

const router = express.Router();

router.get('/signup', (req, res) => {
    try {
        res.render('signup');
    } catch (error) {
        console.log(error);
    }
});

router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const validation = await validate(req, res);
        if (!validation) { return; }

        const newUser = new User({
            username,
            password: await pwdEncrypt(password),
        });
        await newUser.save();
        res.render('login');
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;
