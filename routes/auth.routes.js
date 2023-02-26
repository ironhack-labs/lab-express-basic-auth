const { Router } = require('express');
const router = new Router();
const mongoose = require('mongoose')

const bcryptjs = require('bcryptjs');

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');


const User = require('../models/User.model');
const saltRounds = 10;

router.get('/userProfile', isLoggedIn, (req, res) => {
    res.render('users/user-profile', { userInSession: req.session.currentUser });
  });

router.get('/main', isLoggedIn, (req,res,next) => res.render('users/main'))
router.get('/private', isLoggedIn, async (req,res,next) => res.render('users/private'))



router.get('/signup', isLoggedOut, (req, res) => res.render('auth/signup'));


router.post('/signup', isLoggedOut, async (req, res, next) => {
    const { username, password } = req.body;


try {

    if (!username || !password) {
        res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username and password.' });
        return;
      }

      const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }

    let hash = await bcryptjs.genSalt(saltRounds)
    let hashedPassword = await bcryptjs.hash(password, hash)
    let user = await User.create({
        username,
        passwordHash: hashedPassword
    })
    res.redirect('/userProfile')


} catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('auth/signup', { errorMessage: error.message });
    } else if (error.code === 11000) {
        res.status(500).render('auth/signup', {
            errorMessage: 'Username needs to be unique. Username is already in use.'
        });
    } else {
        next(error);
    }

}
})

router.get('/login', isLoggedOut, (req,res,next)=> {

    try {
        res.render('auth/login')
    } catch (error) {
        console.log("Error with LOGIN GET", error)
        next(error)
    }
})

router.post('/login', isLoggedOut, async (req,res, next) => {
    console.log('SESSION ====>', req.session)

    const { username, password } = req.body


    try {

        if (username === '' || password === '') {
            res.render('auth/login', {
                errorMessage: 'Please enter both username and password to login.'
            });
            return;
        }

        const findUser = await User.findOne({ username })

            if (!findUser) {
                res.render('auth/login', { errorMessage: 'Username is not registered.' });
                return;
            } else if (bcryptjs.compareSync(password, findUser.passwordHash)) {
                req.session.currentUser = findUser;
                res.redirect('/userProfile');
            } else {
                res.render('auth/login', { errorMessage: 'Incorrect password.' });
            }




    } catch (error) {
        console.log("The error is with LOGIN POST", error)
        next(error)
    }
})

router.post('/logout', isLoggedIn, (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            console.log("Error with the logout POST");
            next(err)
        }
        res.redirect('/')
    })
})









module.exports = router;
