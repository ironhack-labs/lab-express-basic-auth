const router = require('express').Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model');



router.get('/signup', (req, res, next) => {
    res.render('auth/signup');
})

router.get('/signin', (req, res, next) => {
    res.render('auth/signin');
});

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.render('auth/signup.hbs', { error: 'Please enter all fields' })
        return;
    }

    let passRegEx = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$/

    if (!passRegEx.test(password)) {
        res.render('auth/signup.hbs', { error: 'Password needs to have a special character a number and be 8-12 characters' })
        // To tell JS to come out off this function
        return;
    }

    // add a random string before encrypted password === (10) is the number of hash processes
    const salt = bcrypt.genSaltSync(10);

    // Uses the salt and your password to create a hashed password
    const hash = bcrypt.hashSync(password, salt);

    // creating document inside the DB 
    UserModel.create({ username, password: hash })
        .then(() => {
            res.redirect('/')
        })
        .catch((err) => {
            next(err)
        })
});

router.post('/signin', (req, res, next) => {
    const { username, password } = req.body

    UserModel.findOne({ username })
        .then((user) => {
            if (user) {
                let isValid = bcrypt.compareSync(password, user.password)
                if (isValid) {
                    req.session.loggedInUser = user
                    req.app.locals.isLoggedIn = true
                    res.redirect('/')
                }
                else {
                    res.render('auth/signin', {error: 'password is invalid'})
                }
            }
            else {
                    res.render('auth/signin', { error: 'user does not exist' })
                }
            })
        .catch((error) => {
            next(error)
        })
});

router.get('/main', checkLoggedIn, (req, res, next) => {
    res.render('main');
});

router.get('/private', checkLoggedIn, (req, res, next) => {
    res.render('private');
});

router.get('/logout', (req, res, next) => {
    
    req.session.destroy();
    req.app.locals.isLoggedIn = false;
    res.redirect('/');
});

function checkLoggedIn(req, res, next) {
    if (req.session.loggedInUser) {
        next();
    } else {
        res.redirect('/')
    }
}

module.exports = router;