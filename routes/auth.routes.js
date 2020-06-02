const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model')

/* GET home page */
router.get('/signup', (req, res, next) => {
    res.render('auth/signup.hbs');
});

router.post('/signup', (req, res, next) => {
    const {username, password} = req.body;


  
  if(!username || !password) {
    res.status(500)
      .render('auth/signup.hbs', {
        errorMessage: 'Please enter username and password'
      });
    return;  
    }

    const myPassRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/);
    if (!myPassRegex.test(password)) {
    res.status(500)
        .render('auth/signup.hbs', {
            errorMessage: 'Password needs to have 8 characters, a number and an Uppercase alphabet'
        });
        return;  
    }

    bcrypt.genSalt(12)
    .then((salt) => {
        console.log('Salt: ', salt);
        bcrypt.hash(password, salt)
        .then((passwordHash) => {
            UserModel.create({username, passwordHash})
            .then(() => {
                req.session.loggedInUser = {username, passwordHash};
                res.redirect('/profile/main');
            })
            .catch((err) => {
                if (err.code === 11000) {
                res.status(500)
                .render('auth/signup.hbs', {
                    errorMessage: 'username already exists!'
                });
                return;  
                } 
                else {
                res.status(500)
                .render('auth/signup.hbs', {
                    errorMessage: 'Something went wrong! Go to sleep!'
                });
                return; 
                }
            })
        });  
    });

    

});

router.get('/login', (req, res) => {
    if(req.session.loggedInUser) {
        res.redirect('/profile/main');
    } else {
        res.render('auth/login.hbs');
    }
});
  
    // let globalData = '';
  
router.post('/login', (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) {
    res.status(500)
        .render('auth/login.hbs', {
        errorMessage: 'Please enter username and password'
        });
        return;  
    }

    UserModel.findOne({username})
    .then((userData) => {
    //chech if passwords match
    bcrypt.compare(password, userData.passwordHash)
    .then((doesItMatch) => {
        if (doesItMatch) {
        req.session.loggedInUser = userData;
        res.redirect('/profile/main');
        
        }
        else {
        res.status(500)
        .render('auth/login.hbs', {
            errorMessage: 'Password is incorrect'
        });
        return;
        }
    })
    .catch(() => {
        res.status(500)
        .render('auth/login.hbs', {
        errorMessage: 'Something went wrong comparing passwords'
    });
    return;
    });
    })
    .catch(() => {
    res.status(500)
    .render('auth/login.hbs', {
        errorMessage: 'Something went wrong finding user'
    });
    return;
    });
});

router.get('/profile/main', (req, res) => {
    if(req.session.loggedInUser) {
        res.render('users/main.hbs', {UserData: req.session.loggedInUser});
    } else {
        res.render('auth/login.hbs');
    }
})
router.get('/profile/private', (req, res) => {
    if(req.session.loggedInUser) {
        res.render('users/private.hbs', {UserData: req.session.loggedInUser});
    } else {
        res.render('auth/login.hbs');
    }
})

router.get('/logout', (req, res) => {
        req.session.destroy();
        res.redirect('/');
});

module.exports = router;
