const express = require('express');
const router = express.Router();
const userModel = require("../../models/user")
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/* GET home page */
router.get('/', (req, res, next) => {
    res.render('signup');
});

router.post('/signup', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    if (!username || !password) {
        res.render("signup", {
            errorMessage: "Need a username and password to signup"
        });
        return;
    }

    userModel.find({ username: username })
        .then(user => {
            if (user !== null) {
                res.render("signup", {
                    errorMessage: "ERROR: This username already exists"
                });
                return;
            }
        })

    userModel.create({
        username,
        password: hashPass
    })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err));
});

router.get('/login', (req, res) => {
    console.log(req.session);
})

module.exports = router;