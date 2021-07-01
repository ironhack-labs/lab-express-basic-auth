const router = require("express").Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.get('')

router.post('/signup', (req, res, next) => {
    const {username, password} = req.body;

    if (username.length < 3) {
        res.render('signup', {message: 'The Username must have at least 3 characters'});
        return;
    }

    if (password.length < 8) {
        res.render('signup', {message: 'The Password must have at least 8 characters'});
        return;
    }

    User.findOne({username: username})
        .then(userFromDB => {
            if (userFromDB !== null) {
                res.render('signup', {message: 'This Username is already taken'});
                return;
            } else {
                const salt= bcrypt.genSaltSync();
                const hash = bcrypt.hashSync(password, salt);
                console.log({hash});

                User.create({username: username, password: hash})
                    .then(createdUser => {
                        console.log(createdUser)
                        res.redirect('login');
                    })
                    .catch(err => {
                        next(err);
                    })
            }

        })

        .catch(err => {
            next(err);
        })
})

module.exports = router;