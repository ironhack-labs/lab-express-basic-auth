const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt")
const User = require("../models/user");


router.post('/login', (req, res, next) => {
    let username = req.body.username
    let password = req.body.password


    User
        .findOne({ username: username })
        .then((userData) => {

            const isAuthorized = bcrypt.compareSync(password, userData.password)

            if (isAuthorized) {
                res.render("success", userData)
            } else {
                res.render("no-success")
            }

        })
        .catch((error) => {
            console.log("el usuario no existe", error)
        })
});
router.get('/login', (req, res, next) => {
    const data = {
        action: "login"
    }
    res.render("index", data);
});


router.get('/', (req, res, next) => {
    res.render('index');
});

router.get('/signup', (req, res, next) => {
    const data = {
        action: "signup"
    }
    res.render("index", data);
});

router.post('/signup', (req, res, next) => {
    if (req.body.password.lenght == 0) {
        res.json({ error: true });
        return;
    }

    let saltRounds = 1
    let salt = bcrypt.genSaltSync(saltRounds)
    let encryptedPwd = bcrypt.hashSync(req.body.password, salt)


    User
        .create({ username: req.body.username, password: encryptedPwd })
        .then((userGenerated) => {
            res.render("success", userGenerated)
        })
        .catch((error) => {
            res.render("no-success", error)
        })
});

router.get('/main', (req, res, next) => {
    res.render('main');
});
router.get('/private', (req, res, next) => {
    res.render('private');
});

module.exports = router;