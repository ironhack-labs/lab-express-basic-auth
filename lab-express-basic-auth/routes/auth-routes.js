const express = require('express');
const router  = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

/* GET home page */
// router.get('/', (req, res, next) => {
//   res.render('home');
// });

router.get('/signup', (req, res) => {
  res.render('auth/signup');
})

router.post('/signup', (req,res) => {
  const {username, password} = req.body;
  
      
  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    })
    return;
  }

  User.findOne({ "username": username },
       "username", (err, user) => {
          if (user !== null) {
          res.render("auth/signup", {
            errorMessage: "The username already exists"
      })
      return;
    }
 
  const salt =  bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password,salt);
  const newUser = User({username, password: hashPass});

  newUser.save((err)=>{
    if (err) {
      res.render('auth/signup', {
        errorMessage: "Something went wrong"
      })
    } else {
    res.redirect('/');
    }
  });
});
});

router.get('/login', (req, res) =>{
  res.render('auth/login');
})

router.post('/login', (req, res) => {
  const {username, password} = req.body;
  if (username == "" || password == ""){
    res.render('auth/login', {errorMessage: "Se necesita usuario y contraseña"});
    return;
  }
  User.findOne({username},(err,user)=>{
    if (err || !user) {
      res.render("auth/login", {
        errorMessage: "The username doesn't exist"
      });
      return;
    }
    if (bcrypt.compareSync(password,user.password)){
      req.session.currentUser = user;
      res.redirect('/');
    } else {
      res.render('auth/login',{errorMessage: "wrong password"})
    }
  })
})

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/login');
  })
})


module.exports = router;