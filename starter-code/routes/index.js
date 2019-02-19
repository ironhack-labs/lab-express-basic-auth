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

module.exports = router;
