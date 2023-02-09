const express = require('express');
const router = express.Router()
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;


// SIGNUP ROUTES !!!!

router.get('/signup', (req, res, next) => {
    try {
        res.render('auth/signup')

    } catch (error) {
        next(error)
    }
})

router.post('/signup', async (req, res, next) => {
    try {

        const { username, password } = req.body

        const foundUser = await User.findOne({ username });
        if (foundUser) {
            res.render('auth/signup', { errorMessage: "User already exists" })
            return; // end here if the user is found
        }

        // validade password

        // STRICT PASSWORD REGEX--> 6 character and must contain one Uppercase letter, one lowercase letter and one number
        // const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm

        // NOT STRICT PASSWORD REGEX --> ANYTHING BASICLY
        const passwordRegex = /\w+/gm


        // if the password doenst match the regex rule
        if (!passwordRegex.test(password)) {
            return res.status(500).render('auth/signup',
                {
                    errorMessage: 'Password must contain at least 6 character and must contain one Uppercase letter, one lowercase letter and one number'
                })
        }

        const salt = await bcryptjs.genSalt(saltRounds);
        const passwordHash = await bcryptjs.hash(password, salt);

        await User.create(
            {
                username,
                passwordHash
            }
        )

        res.redirect('/');

    } catch (error) {
        next(error)
    }
})




// LOGIN ROUTES !!!!
router.get('/login', (req, res, next) => {
    try {
        res.render('auth/login')

    } catch (error) {
        next(error)
    }
})



router.post('/login', async (req, res, next) => {

    try {

        const { username, password } = req.body;

        if (!username || !password) {
            res.render('auth/login', { errorMessage: 'missing fields' })
            return;
        }


        const foundUser = await User.findOne({ username })

        if (!foundUser) {
            res.render('auth/login', { errorMessage: 'invalid login' })
            return
        }

        const isPasswordCorret = bcryptjs.compareSync(password, foundUser.passwordHash)

        if (!isPasswordCorret) {
            res.render('auth/login', { errorMessage: 'invalid login' })
            return
        }


        // if everything is correct 
        // attach the user to current user 
        req.session.currentUser = foundUser;


        // add user to the session 
        res.redirect('/')

    } catch (error) {
        next(error)
    }
})






// LOGOUT

router.post('/logout', (req, res, next) => {
    // destoing the session wen log out is pressed 
    req.session.destroy((error) => {
        if (error) {
            next(error)
        }

        res.redirect('/')
    })
})



module.exports = router