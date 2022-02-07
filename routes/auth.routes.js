const router = require("express").Router()
const bcryptjs = require('bcryptjs')

const User = require('../models/User.model')
const saltRounds = 10

router.get("/signup", (req, res, next) => res.render("auth/signup"))

router.post("/signup", (req, res, next) => {

    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render("auth/signup", {
            errorMessage: "Please enter both, username and password to login."
        });
        return;
    }

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            console.log(`Password hash: ${hashedPassword}`)
            return User.create({ username, password: hashedPassword })
        })
        .then(() => res.redirect('/'))
        .catch(error => next(error))
})

router.get("/login", (req, res) => res.render("auth/login"))

router.post("/login", (req, res, next) => {
    const { username, password } = req.body;

    if (username.length === 0 || password.length === 0) {
        res.render("auth/login", {
            errorMessage: "Please enter both, username and password to login."
        });
        return;
    }

    User.findOne({ username })
        .then(user => {
            if (!user) {
                res.render("auth/login", { errorMessage: "Username is not registered. Try with other Username." });
                return;
            } else if (bcryptjs.compareSync(password, user.password)) {
                res.render("users/user-profile", { user });
                req.session.currentUser = user
            } else {
                res.render("auth/login", { errorMessage: "Incorrect password." });
            }
        })
        .catch(error => next(error));
});

module.exports = router