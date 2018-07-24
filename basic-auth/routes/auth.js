const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require('../models/user');

/* GET users listing. */
router.get('/signup', function(req, res, next) {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.render('auth/signup',{ message: 'Rellena los campos melón!'});
  }    
  User.findOne({ username })
    .then(user => {
      if (user) {        
        return res.render('auth/signup', {message: 'El usuario ya existe'});
      } else {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const newUser = new User({ username, password: hashedPassword });
        newUser.save();
        req.session.currentUser = newUser;
        return res.redirect('/');     
      }
    })    
    .catch(error => {
      next(error);
    })
})

router.get('/login', (req,res,next) => {
  res.render('auth/login');
})

router.post('/login', (req,res,next) => {
  const { username, password } = req.body;
  // Otra ñapita para comprobar que está vacío 
  if (!username || !password) return res.render('auth/login', { message: 'Los campos no pueden estar vacios'});
  User.findOne({ username })
    .then(user => {
      // Guarreria excepcional
      if(!user) return res.render('auth/login', { message: 'Usuario o password incorrectos'});
      else if (bcrypt.compareSync(password /* provided password */, user.password/* hashed password */)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.redirect("/auth/login");
      }
    })
})

router.post('/logout', (req,res,next) => {
  delete req.session.currentUser;
  res.redirect('/');
})

module.exports = router;
