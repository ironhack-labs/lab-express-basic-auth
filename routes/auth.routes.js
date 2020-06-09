const { Router } = require('express');
const router = new Router();
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const User = require('../models/User.model')


router.get('/signup', (req, res) => res.render("auth/signup"));
router.get('/userProfile', (req, res) => res.render("users/user-profile"))

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;

    bcrypt.genSalt(saltRounds)
        .then(salt => bcrypt.hash(password, salt))
        .then(hashedPassword => {
            User.create({
                username: username,
                passwordHash: hashedPassword
            })
                .then(data => {
                    console.log("Usuario creado.Datos:", data);
                    res.redirect("/userProfile")
                })
                .catch(err => next(err))
        })
        .catch(err => next(err))
});

module.exports = router;
