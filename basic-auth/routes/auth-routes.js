const express = require('express');
const router  = express.Router();
const User = require('../models/user')

/*--------------------------------*/
const bcrypt     = require("bcrypt");
const saltRounds = 10;

//const plainPassword1 = "HelloWorld";
//const plainPassword2 = "helloworld";
//
//const salt  = bcrypt.genSaltSync(saltRounds);
//const hash1 = bcrypt.hashSync(plainPassword1, salt);
//const hash2 = bcrypt.hashSync(plainPassword2, salt);
//
//console.log("Hash 1 -", hash1);
//console.log("Hash 2 -", hash2);
/*--------------------------------*/

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req,res,next) => {
  res.render('auth/signup')
})

router.post('/register', (req,res,next) => {
  const username = req.body.Username;
  const password = req.body.Password;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashPass = bcrypt.hashSync(password, salt);
  
  if ( username === '' || password === '') {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ 'username': username})
  .then(user => {
    if(user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }
    
    const newUser = new User({
      username: req.body.Username,
      password: hashPass
    });
    
    newUser.save()
    .then(() => {
      console.log('entra lalalalalal');
      res.redirect('/')
    })
  })
    .catch(err => next(err))
    
})



module.exports = router;