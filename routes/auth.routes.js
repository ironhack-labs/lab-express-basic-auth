const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const mongoose = require('mongoose');

router.get('/signup', (req, res) => {
    res.render('auth/signup');
    }
);

router.post('/signup', (req, res) => {
    const {username, password}  = req.body;
    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(password, salt))
        .then(hashedPassword => {
            return User.create({
                username,
                password: hashedPassword
            });
        })
        .catch(error => {
                next(error);
            }
        );
    }
);
