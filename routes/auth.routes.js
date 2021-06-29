const User = require("../models/User.model");
const router = require("express").Router();
const bcrypt = require('bcryptjs');


//-------- SIGN UP --------
// Handle GET request to /signup page
router.get('/signup', (req, res, next) => {
    res.render('auth/signup.hbs')
})

// Handle POST request to /signup page + send input to DB
router.post('/signup', (req, res, next) => {
    const {username, password} = req.body

    // check user has filled in all fields
    if (!username || !password) {
        res.render('auth/signup.hbs', {error: 'Please enter all fields'})
        return;
    }

    // check the password strength
    const passRegEx = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    if (!passRegEx.test(password)) {
        res.render('auth/signup.hbs', {error: 'Password not strong enough. Make sure your password is 6-16 characters long and includes both a special character and a number.'})
        return;
    }

    // Password encyrption time! 
    // Generate salt
    const salt = bcrypt.genSaltSync(10);
    // Uses the salt and the password to create a hashed password
    const hash = bcrypt.hashSync(password, salt);
    User.create({username, password: hash})
        .then(() => {
            res.redirect('/')
        })
        .catch((err) => {
            next(err)
        })

})
//-------------------------

module.exports = router;