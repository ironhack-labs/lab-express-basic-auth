const express = require('express')
const router = express.Router();

const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const { model } = require('../models/User.model');
const bcryptSalt = 10;

router.get("/signup", (req, res, next) => {
    res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
    const {username, password} = req.body;

    if (username === "" || password === "") {
        res.render ("auth/signup", { err: "Some field is empty, fill it up!"})
        return;
    }

    User.findOne({username})
        .then ((user) => {
            if (user !== null) {
                res.render('auth/signup', { err: "User already exists d'oh"});
                return;
            }
        
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPassword = bcrypt.hashSync(password, salt);

            User.create({username, password: hashPassword})
                .then(() => {
                    res.redirect('/')
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            next(err);
        });
});

router.get('/login', (req, res, next) => {
    res.render('auth/login');
});

router.post('/login', (req, res , next) => {
    const {username, password} = req.body;

    if (username === "" || password === "") {
        res.render ("auth/login", { err: "Some field is empty, fill it up!"})
        return;
    }

    User.findOne({username})
        .then((user) => {
            if (!user) {
                res.render('auth/login', { err: "User doesn't exists, do you want to create an account?"})
                return;
            }
            if (bcrypt.compareSync(password, user.password)) {
                req.session.currentUser = user;
                res.redirect('/');
            } else {
                res.render('auth/login', { err: "Wrong password fool!"})
            }
        })
        .catch((err) => {
            next(err);
        })

});
        

module.exports = router;