const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');

const { validateSignup, validateLogin } = require('../utils/dataValidate');
const { pwdEncrypt, pwdCompare } = require('../utils/passwdManager');

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
        const validation = await validateSignup(req, res);
        if (!validation) { return; }

        const newUser = new User({
            username,
            password: await pwdEncrypt(password),
        });
        await newUser.save();
        res.redirect('/login');
    } catch (error) {
        console.log(error);
    }
});

router.get('/login', (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error);
    }
});

router.post('/login', async (req, res) => {
    try {
        const validation = await validateLogin(req, res);
        if (!validation) { return; }

        const userCopy = JSON.parse(JSON.stringify(validation));
        delete userCopy.password;

        req.session.currentUser = userCopy;

        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
