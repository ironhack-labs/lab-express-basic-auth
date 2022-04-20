// routes/auth.routes.js
 
const { Router } = require('express');
const router = new Router();

const User = require('../models/User.model');

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const mongoose = require('mongoose');

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

router.get('/signup', isLoggedOut, (req, res) => res.render('auth/signup'));

router.post('/logout', isLoggedIn, (req, res, next) => {
    req.session.destroy(err => {
      if (err) next(err);
      res.redirect('/');
    });
  });

router.get('/login', isLoggedOut, (req, res) => res.render('auth/login'));

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;
   
    if (!username || !password) {
      res.render('auth/login', {
        errorMessage: 'Please enter both, email and password to login.',
        attempt: username
      });
      return;
    }
    User.findOne({ username })
      .then(user => {
        if (!user) {
          res.render('auth/login', { errorMessage: 'User not found.' });
          return;
        } else if (bcryptjs.compareSync(password, user.passwordHash)) {
          req.session.currentUser = user;
          res.redirect('/profile');
        } else {
          res.render('auth/login', { errorMessage: 'Incorrect password.', attempt: username });
        }
        // console.log('SESSION =====> ', req.session);
      })
      .catch(error => next(error));
  });

router.post('/signup', async (req,res,next) =>{
const { username, password } = req.body;
    if(!username || !password){
        res.render('auth/signup', { errorMessage: 'Required field missing', attempt: username});
        return;
    }
    try{
        const hashed =  await saltPassword(password);
        const newUser = await User.create({username,passwordHash:hashed});
        console.log('User created ', newUser);
        res.render('auth/login',{successMessage: `${username} created!  You can now login below`});
    }catch (err){
        if (err instanceof mongoose.Error.ValidationError) {
             res.status(500).render('auth/signup', { errorMessage: err.message, attempt: username });
        } else if (err.code === 11000) {
             res.status(500).render('auth/signup', {
            errorMessage: 'Username already in use - must be unique.'
        });
        }
        console.log('Failed to create user ',err);
        next(err);
    }
});

router.get('/main', isLoggedIn ,(req, res, next) => res.render('main',{ userSession: req.session.currentUser }));

router.get('/private', isLoggedIn, (req, res, next) => res.render('private',{ userSession: req.session.currentUser }));


async function saltPassword(password){
    try{
        const hashedPassword = await bcryptjs.hash(password,saltRounds);
        console.log(hashedPassword);
        return hashedPassword;
    }catch{
        console.log('Failed to encrypt PW - dying');
    }
}

module.exports = router;