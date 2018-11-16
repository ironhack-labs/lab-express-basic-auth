const express = require('express');
const router  = express.Router();
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const bodyParse = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const User = require('../models/User')
const genericUser = new User();


mongoose
.connect('mongodb://localhost/authApp', {userNewUrlParser: true})
.then(x => console.log(`Connected to Mongo! Database name: '${x.connection[0].name}'`))


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

// POST params from form Sing Up
router.post('/', (req, res, next) => {
  
  const saltRounds = 5;

  genericUser.user = req.body.user

  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(req.body.password, salt);

  genericUser.password = hash;

  genericUser.save().then(x => {
    req.session.inSession = true
  })

  res.redirect('/login');

  console.log(req.body);
})


router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {

  console.log(req.body);

  User.findOne({
    user: req.body.user
  })
  .then(found => {
    const matches = bcrypt.compareSync(req.body.password, found.password)

    if (matches) {
      req.session.inSession = true;
      req.session.user = req.body.user
      res.redirect('/home')
    } else {
      req.session.inSession = false;
      res.redirect('/login');
    }

  })
})


router.get('/logout', (req, res, next) =>{
  console.log(req.session)
  req.session.destroy(() => { console.log('entra')
    req.session = null;
    res.redirect('/')
  })
})


router.get('/home', (req, res, next) => {
  if (req.session.inSession) {
    let sessionData = {...req.session}
    res.render('home', {sessionData});
  } else {
    res.render('404');
  }
})

router.get('/main', (req, res, next) => {
  if (req.session.inSession) {
    let sessionData = {...req.session}
    res.render('main', {sessionData});
  } else {
    res.render('/login');
  }
})

router.get('/private', (req, res, next) => {
  if (req.session.inSession) {
    let sessionData = {...req.session}
    res.render('private', {sessionData});
  } else {
    res.render('/login');
  }
})


module.exports = router;