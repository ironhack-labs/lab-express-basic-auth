const express = require('express');
const router  = express.Router();
const session = require('express-session');
const MongoStore = require("connect-mongo")(session)
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const User = require('../models/User');






/* GET home page */
router.get('/', (req, res, next) => {
  res.render('singUp');
});

module.exports = router;

router.post('/singUp', (req, res, next) => {
  
  const genericUser = new User();


const saltRounds = 5 ;
genericUser.user = req.body.user;

const salt = bcrypt.genSaltSync(saltRounds);
const hashedPassword = bcrypt.hashSync(req.body.password,salt);

genericUser.password = hashedPassword;

genericUser.save().then((x) => {
  // req.session.inSession = true;
  res.redirect('/login');

  
});
})

router.get('/login', (req, res) => {
  res.render('login');
})

router.post('/login', (req, res, next) => {
  console.log(req.body.user);
    User.findOne({
      user: req.body.user
    }).then(found => {
      
      const matches = bcrypt.compareSync(req.body.password, found.password)
  
      if (matches) {
        // req.session.inSession = true
        //req.session.user = req.body.user
        res.redirect('/principal')
      } else {
        // req.session.inSession = false
        
        res.redirect('/login')
      }
    })
})


router.get('/private', (req, res, next) => {
  res.render('private');
})