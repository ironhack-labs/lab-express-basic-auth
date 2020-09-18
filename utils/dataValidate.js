const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User.model');
const { pwdEncrypt, pwdCompare } = require('./passwdManager');

const validateSignup = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        const errors = {
            usernameError: !username ? 'Please fill your user name' : undefined,
            passwordError: !password ? 'Please fill your password' : undefined,
        };
        res.render('signup', errors);
        return false;
    }
    const userExists = await User.find({ username });
    if (userExists.length > 0) {
        const errors = { usernameError: userExists.length > 0 ? 'Username already taken' : undefined };
        res.render('signup', errors);
        return false;
    }
    return true;
};

const validateLogin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        const errors = {
            usernameError: !username ? 'Please fill your user name' : undefined,
            passwordError: !password ? 'Please fill your password' : undefined,
        };
        res.render('login', errors);
        return false;
    }

    const userExists = await User.findOne({ username });
    if (!userExists) {
        res.render('login', { errorMessage: 'Incorrect username or password. Please try again.' });
        return false;
    }

    const verifiedPwd = await pwdCompare(password, userExists.password);
    if (!verifiedPwd) {
        res.render('login', { errorMessage: 'Incorrect username or password. Please try again.' });
        return false;
    }

    return userExists;
};

module.exports = { validateSignup, validateLogin };
