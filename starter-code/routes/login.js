const express = require('express');
const router  = express.Router();
const User    = require('../models/user');
const bcrypt  = require('bcrypt');
const bcryptSalt = 10;

router.get('/', (req, res, next) => {
  res.render('auth/login');
})

router.post('/', (req, res, next) => {
    const { username, password } = req.body;
    if(username === "" || password === "") {
        res.render('auth/login', {
            errorMessage: 'Indicate a username and a password to login'
        });
        return
    }
    User.findOne({ 'username': username })
        .then(user => {
            if(!user) {
                res.render('auth/login' , {
                    errorMessage: 'This user doesn\'t exists'
                });
                return
            }
            if(bcrypt.compareSync(password, user.password)){
                /* Save the login in the session! Search for more inteligent manners
                of doing session save instead of saving it inside the mongo DB. */
                req.session.currentUser = user;
                res.redirect('/');
            } else {
                res.render('auth/login', {
                  errorMessage: 'Incorrect username or password, please try again.'
                })
            }
        })
        .catch(err => {
          next(err)
        })
    
})

module.exports = router;
