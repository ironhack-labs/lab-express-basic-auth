const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User.model");

//SIGNUP
router.get('/signup', (req, res, next) => res.render('auth/signup'));
router.post('/signup', async(req, res, next) => {

    const { username, password } = req.body

    if (username === "" || password === "") {
        return res.render("auth/signup", { error: "missing fields" })
    }

    const existingUser = await User.findOne({ username })

    if (existingUser) {
        return res.render("auth/signup", { error: "User already created" })
    }

    const salt = bcrypt.genSaltSync(12);
    const passwordSecreto = bcrypt.hashSync(password, salt);
    const user = await User.create({
        username,
        password: passwordSecreto
    })

    res.redirect("/auth/login")
});

//LOGIN
router.get('/login', (req, res, next) => res.render('auth/login'));
router.post('/login', async(req, res, next) => {

    const { username, password } = req.body

    if (username === "" || password === "") {
        return res.render("auth/login", { error: "missing fields" })
    }

    const existingUser = await User.findOne({ username })

    if (!existingUser) {
        return res.render("auth/login", { error: "User doesn't exist" })
    }

    if (bcrypt.compareSync(password, existingUser.password)) {
        req.session.user = existingUser;
        res.redirect("/auth/private")
        console.log('SESSION =====> ', req.session)
    } else {
        return res.render("auth/login", { error: 'password no correctouw' })
    }
});


router.get('/private', (req, res) => {
    console.log(req.session.user)
    if (req.session.user) {
        res.render('private/private', {
            userInSession: req.session.user
        });

    } else {
        res.redirect("/");
    }
});

router.get('/main', (req, res) => {
    console.log(req.session.user)
    if (req.session.user) {
        res.render('private/main', {
            userInSession: req.session.user
        });

    } else {
        res.redirect("/");
    }
});

module.exports = router;