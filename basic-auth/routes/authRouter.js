const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const bcryptSalt = 10;

/* GET home page */
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const  {username, password } = req.body;

  User.findOne({username})
    .then( user => {
      if(user!=null){
        throw new Error("Username already exists.")
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      return User.create({
        username,
        password: hashPass
        });
    })
    .then(()=>{
      res.redirect('/');
    })
    .catch(e=>{
      console.log(e);
      res.render('auth/signup', {errorMessage: e.message})
    })
})
module.exports = router;
