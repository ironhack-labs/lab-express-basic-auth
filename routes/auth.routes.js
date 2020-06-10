const { Router } = require('express');
const router = new Router();
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const mongoose = require('mongoose');
const User = require('../models/User.model')


router.get('/signup', (req, res) => res.render("auth/signup"));
router.get('/userProfile', (req, res) => {
    console.log(req.session.currentUser);
    res.render('users/user-profile',{user: req.session.currentUser})
    
})

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.render('auth/signup', { errorMessage: 'Las informaciones username, email y contraseña son mandatorias' });
        return;
    }
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
        res.render('auth/signup', { errorMessage: 'La contraseña tienen q tener 6 ch, 1may y min' });
        return;
    }

    bcrypt.genSalt(saltRounds)
        .then(salt => bcrypt.hash(password, salt))
        .then(hashedPassword => {
            User.create({
                username: username,
                passwordHash: hashedPassword
            })
                .then(user => {
                    console.log("Usuario creado.Datos:", user);
                    req.session.currentUser = user;
                    res.redirect("/userProfile")
                })
                .catch(error => {
                    if (error instanceof mongoose.Error.ValidationError) {
                        res.status(400).render('auth/signup', {
                            errorMessage: error.message
                        });

                    } else if (error.code === 11000) {
                        //error de duplicidad
                        res.status(500).render('auth/signup', { errorMessage: 'username o correo ya existen...' });

                    } else {
                        next(error);
                    }
                })
        })
        .catch(err => next(err))
});

router.get('/login', (req, res) => {
    console.log(req.session);
    res.render('auth/login');
});

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;
    if (username === '' || password === '') {
      res.render('auth/login', {
        errorMessage: 'Please enter both, username and password to login.'
      });
      return;
    }
  
    User.findOne({ username })
      .then(user => {
        if (!user) {
          res.render('auth/login', { errorMessage: 'User is not registered. Try with other username.' });
          return;
        } else if (bcrypt.compareSync(password, user.passwordHash)) {
          req.session.currentUser=user;
          res.redirect('/userProfile');
        } else {
          res.render('auth/login', { errorMessage: 'Incorrect password.' });
        }
      })
      .catch(error => next(error));
  });
  
  router.post('/logout', (req,res,next)=>{
    req.session.destroy();
    res.redirect('/');
  });

  router.get('/main', (req, res, next) => {
    if (!req.session.currentUser) {
      res.redirect('/');
      return;
    }
    res.render('auth/main');
  });

  router.get('/private', (req, res, next) => {
    if (!req.session.currentUser) {
      res.redirect('/');
      return;
    }
    res.render('auth/private');
  });

module.exports = router;
