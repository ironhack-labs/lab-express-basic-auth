const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User.model');

const validate = async (req, res) => {
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

module.exports = validate;
