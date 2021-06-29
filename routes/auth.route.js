const router = require("express").Router();
const UserModel = require('../models/User.model')
const bcrypt = require('bcryptjs');

router.get('/signin', (req, res, next) => {
    res.render('auth/signin.hbs')
})

router.get('/signup', (req, res, next) => {
  res.render('auth/signup.hbs')
})

router.post('/signup', (req, res, next) => {
    const {username, password} = req.body
    if (!username || !password) {
        res.render('auth/signup.hbs', {error: 'Please enter all fields'})
        return;
    }
    let passRegEx = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
    if (!passRegEx.test(password)) {
      res.render('auth/signup.hbs', {error: 'Password needs to have a special character a number and be 6-16 characters'})
      return;
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    UserModel.create({username, password: hash})
      .then(() => {
          res.redirect('/private')
      })
      .catch((err) => {
          next(err)
      })
})

router.post('/signin', (req, res, next) => {
    const {username, password} = req.body    
    UserModel.findOne({username})
        .then((user) => {
           if (user) {
              let isValid = bcrypt.compareSync(password, user.password);
              if (isValid) {
                  req.session.loggedInUser = user
                  req.app.locals.isLoggedIn = true;
                  res.redirect('/private')
              }  
              else {
                  res.render('auth/signin', {error: 'Invalid password'})
              }  
           } 
           else {
             res.render('auth/signin', {error: 'Username does not exists'})
           }
        })
        .catch((err) => {
            next(err)
        })      
})

function checkLoggedIn(req, res, next){
    if ( req.session.loggedInUser) {
        next()
    }
    else{
      res.redirect('/signin')
    }
  }
  
  router.get('/private', checkLoggedIn, (req, res, next) => {
        res.render('auth/private.hbs', {name:  req.session.loggedInUser.username})
  })
  router.get('/main', checkLoggedIn, (req, res, next) => {
    res.render('auth/main.hbs', {name:  req.session.loggedInUser.username})
})
  
  router.get('/logout', (req, res, next) => {
      req.session.destroy()
        req.app.locals.isLoggedIn = false;
      res.redirect('/')
  })

module.exports = router;
