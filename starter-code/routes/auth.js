const express = require('express');
const router  = express.Router();
const User = require('../models/user');
const bcrypt     = require("bcrypt");
const saltRounds = 10;

//SIGN UP 
router.get('/', (req, res, next) => {
  res.render('/');
});

router.post('/signup', (req, res, next) => {

  const username = req.body.username;
  const password = req.body.password;

  const salt = bcrypt.genSaltSync(saltRounds);
  const hashPass = bcrypt.hashSync(password, salt);

  User.create({

    username,
    password: hashPass
  })
  .then(() => {
    res.redirect('/login');
  })
  .catch(error => console.log(error))

});


//LOGIN
router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {

  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if(theUsername === "" || thePassword === "")
  {
    res.render('login', {
      errorMessage: "Please enter both, username and password to login"
    });
    return;
  }

  User.findOne({"username": theUsername})
    .then( user => {
      if(!user)
      {
        res.render('login', { errorMessage: "The username doesnt exists!"});
        return;
      }
      
      if(bcrypt.compareSync(thePassword, user.password))
      {
        req.session.currentUser = user;
        res.redirect('/main');
      }
      else{
        res.render('login', {errorMessage: "Incorrect Password!"});
      }
      
    })
    .catch(error => console.log(error))


});

//LOGOUT
router.get('/logout', (req, res, next) => {
  req.session.destroy((error) => {
    res.redirect('/login');
  })
});

//PRIVATE VIEWS
router.use((req, res, next) => {
  if(req.session.currentUser)
  {
    next();
  }
  else{
    res.redirect('/login');
  }
});

//MAIN
router.get('/main', (req, res, next) => {
  res.render('main', {user: req.session.currentUser});
});

//HOME
router.get('/home', (req, res, next) => {
  res.render('home', {user: req.session.currentUser});
});

//PRIVATE
router.get('/private', (req, res, next) => {
  res.render('private');
});


module.exports = router;