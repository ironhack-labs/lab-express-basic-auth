const router = require("express").Router();
const User = require('../../models/User.model');
const bcrypt = require('bcrypt');


router.get("/login", (req, res, next) => {
    res.render("auth/login");
});

router.post("/login", (req, res, next) => {
    const {username, password} = req.body;

    User.findOne({username: username})
        .then(userFromDB => {

            if (userFromDB === null ||
                !bcrypt.compareSync(password, userFromDB.password)) {
                res.render('auth/login', {message: 'USERNAME OR PASSWORD IS INCORRECT'})
            } else {
                req.session.user = userFromDB
                res.redirect('/private')
            }
        })
});

router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});


router.post("/signup", (req, res, next) => {
    const {username, password} = req.body;

    User.findOne({username: username})
        .then(user => {

            if (user !== null) {
                res.render('auth/signup', {message: 'Your username is already taken'})
            } else {
                User.create({username: username, password: ComputeHash(password)})
                    .then(() => {
                        res.redirect('/login')
                    })
                    .catch(err => next(err))
            }
        })
});

router.get("/logout", (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            next(err)
        } else {
            res.redirect('/')
        }
    })
});

function ComputeHash(password) {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt)
}

module.exports = router;