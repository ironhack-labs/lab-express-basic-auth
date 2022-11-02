const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const mongoose = require('mongoose');
/* const { isLoggedOut } = require('..middleware/route-guard') */


router.get('/signup', (req, res, next) => res.render('auth/signup'))

router.post('/signup', async(req, res, next) => {
    const {username, password} = req.body;

    try {
       if(!username || !password) {
       res.render('auth/signup' , {
        errorMessage: 'You need to fill up all of the fields in order to signup!',

       });
       return;
    }
       
       const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
       if(!regex.test(password)) {
        res.status(500).render('auth/signup', {
            errorMessage:
            'Your password needs to include an uppercase and a lowercase and to have at least 6 characters in order to signup'
        });
       }

       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(password, salt)
       const createdUser = await User.create({username, password: hashedPassword})

       res.redirect('/')

    } catch (error) {
        console.log(error);
        if(error instanceof mongoose.Error.ValidationError) {
            res.status(500).render('auth/signup', {errorMessage: error.message})
        } else if(error.code === 11000) {
            res.status(500).render('auth/signup', {errorMessage: 'Username is already used'})
        }
        next(error);
    }
})


router.get('/login', (req, res, next) => res.render('auth/login'))

router.post('/login', async (req, res, next) => {
    const {username, password} = req.body
    try {
        if(!username || !password) {
            res.render('auth/login', {
                errorMessage : 'Please fill up both of the fields in order to login'
            });
            return;
        }
        const user = await User.findOne({username});

        if(!user) {
            res.render('auth/login', {
                errorMessage: 'User not found',
            });
            return;
        } else if (bcrypt.compareSync(password, user.password)) {
            req.session.user = user;
            res.redirect('/')
        } else {
            res.render('auth/login', {
                errorMessage: 'The password is wrong, please try again'
            })
        }

        
    } catch (error) {
        console.log(error)
        next(error);
    }
})

module.exports = router;