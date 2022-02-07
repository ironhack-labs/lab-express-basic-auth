const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const mongoose = require('mongoose');


exports.register = (req, res) => {
    res.render('auth/register');
}

exports.registerForm = async (req, res) => {
    const {username, password} = req.body;

    const salt  = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const newUser = await User.create({
            username,
            password: hashedPassword
        });
        console.log(newUser);
    } catch (error) {
        console.log(error);
    }
}
