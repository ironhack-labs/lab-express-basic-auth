const express = require('express');
const router  = express.Router();
const User    = require('../models/user.js');
const bcrypt  = require('bcrypt');


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {

  let { username, password } = req.body;

  /** Query database to check if user already exists */

  User.findOne({username})
    .then( obj => {
      if( obj === null){
        /** Encrypt password */

        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        password = bcrypt.hashSync(password, salt);


        /** Create new user with username and encrypted password */
        User.create({ username , password })
          .then( () => {
            res.render('signup', {success: true});
          })
          .catch(err => { console.log('An error occurred: ', err); });
      }
      else {
        res.render('signup', {failure: true});
      }
    })
    .catch(err => { console.log('An error occurred: ', err); });

});

router.post('/login', (req, res, next) => {
  
  let { username, password } = req.body;

  User.findOne({username})
    .then( user => {
      if(user !== null){
        if(bcrypt.compareSync(password, user.password)){
          req.session.currentUser = user;
          res.redirect('/private');
        } else{
          res.render('index', {failure: true});
        }
      } else{
        res.render('index', {failure: true});
      }
      
    })
    .catch(err => { console.log('An error occurred: ', err); });
});






/** PROTECTED ROUTES BELOW CAN ONLY BE ACCESSED AFTER AUTHENTICATION  */

router.use((req, res, next) => {
  if(req.session.currentUser){
    next();
  } else{
    res.render('index', {protected: true});
  }
});

router.get('/private', (req, res, next) => {
  let maxAge = req.session.cookie.expires;
  res.render('private', {maxAge});
});

module.exports = router;
