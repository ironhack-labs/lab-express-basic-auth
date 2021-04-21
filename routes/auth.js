const router = require("express").Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

router.get('/signup', (req, res, next) => {
    res.render('signup');
});

router.get("/login", (req, res, next) => {
    res.render("login");
});

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;
    User.findOne({ username: username })
        .then(userFromDB => {
            if (userFromDB === null) {
                // the user is not in the database -> we show the login formm again
                res.render('login', { message: 'Invalid credentials' });
                return;
            }
            // if the username exists we check the password
            if (bcrypt.compareSync(password, userFromDB.password)) {
                // hashed password from the input and hash match
                // we log the user in
                req.session.user = userFromDB;
                // redirect to profile 
                res.redirect('/profile');
            }
        })
})

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
    console.log({ username, password });

    if (password.length < 7) {
        res.render('signup', { message: 'Your password must have at least 7 chararcters' });
        return
    }
    if (username === '') {
        res.render('signup', { message: 'Your username cannot be empty' });
        return
    }
    User.findOne({ username: username })
        .then(userFromDB => {
            if (userFromDB !== null) {
                res.render('signup', { message: 'This username is already taken' });
            } else {
                const salt = bcrypt.genSaltSync();
                const hash = bcrypt.hashSync(password, salt);

                User.create({ username: username, password: hash })
                    .then(createdUser => {
                        //console.log(createdUser);
                        res.redirect('/login')
                    })
            }
        })
});


module.exports = router;