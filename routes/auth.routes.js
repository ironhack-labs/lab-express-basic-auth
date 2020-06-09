// const express = require('express');
// const router = express.Router();
const { Router } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const router = new Router();

const saltRounds = 10;

/* GET home page */
router.get('/signup', (req, res) => res.render('users/signup'));
router.get('/userProfile', (req, res) => {
    console.log("Sesión: ", req.session);
    res.render('users/user-profile', {user: req.session.currentUser});
});

router.post('/signup', (req, res, next) => {
    const {username, email, password} = req.body;

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

    if (!username || !email || !password) {
        res.render('users/signup', {
        errorMessage: 'Las informaciones username, email y contraseña son mandatorias'
        });
        return;
        
    } else if (!regex.test(password)) {
        res.status(400).render('users/signup', {
        errorMessage: 'La contraseña no es suficientemente segura'
        });
    }
    
    bcrypt.genSalt(saltRounds)
    .then(salt => bcrypt.hash(password, salt))
    .then(hashedPassword => {
        return User.create({
            username: username,
            email: email,
            passwordHash: hashedPassword
        });   
    })
    .then(user => {
        console.log("Usuario creado con éxito. Datos: ", user);
        req.session.currentUser = user;
        res.redirect("/userProfile");
    })
    .catch(err => next(err));
    
});

// LOGIN
router.get('/login', (req, res) => res.render('users/login'));

router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
    if (email === '' || password === '') {
      res.render('users/login', {
        errorMessage: 'Please enter both, email and password to login.'
      });
      return;
    }
  
    User.findOne({ email })
      .then(user => {
        if (!user) {
          res.render('users/login', { errorMessage: 'Email is not registered. Try with other email.' });
          return;
        } else if (bcrypt.compareSync(password, user.passwordHash)) {
          req.session.currentUser = user;
          res.redirect('/userProfile');
        } else {
          res.render('users/login', { errorMessage: 'Incorrect password.' });
        }
      })
      .catch(error => next(error));
});

router.get('/main', (req, res) => {
    if(!req.session.currentUser){
        res.redirect('/');
        return;
    } 

    res.render('users/main');
});

router.get('/private', (req, res) => {
    if(!req.session.currentUser){
        res.redirect('/');
        return;
    } 

    res.render('users/private');
});


module.exports = router;