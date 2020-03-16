const express = require('express');
const router  = express.Router();
const User    = require('../model/user');

const bcrypt  = require('bcrypt');
const bcryptSalt = 10;

/* GET sign-up page */
router.get('/signup', (req, res, next) => {
  res.render('../views/auth/sign-up.hbs');
});

//POST create the user in database;
router.post('/signup',(req,res,next)=> {
  const userName = req.body.username;
  const passWord = req.body.password;
  if(userName ==='' || passWord ==='') {
    res.render('../views/auth/sign-up.hbs',{errorMessage:'Username and password should not be empty.'});
    return;
  }
  User.findOne({username:userName})
    .then(user => {
      if(user) {
        res.render('../views/auth/sign-up.hbs',{errorMessage:'The username already exist!'});
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(passWord,salt);

      User.create({username:userName,password:hashPass})
        .then(()=> {res.redirect('/')})
        .catch(e => {throw e});
    })
    .catch(e => next(e));
})

//GET the log in page
router.get('/login',(req,res,next)=> {
  res.render('../views/auth/log-in.hbs')
});

//POST the log in information
router.post('/login',(req,res,next)=> {
  const theUserName = req.body.username;
  const thePassWord = req.body.password;

  if(theUserName==='' || thePassWord==='') {
    res.render('../views/auth/log-in.hbs',{errorMessage:'the username and the pasword should not be empty.'});
    return;
  }
  User.findOne({username:theUserName})
    .then(user => {
      if(!user) {
        res.render('../views/auth/log-in.hbs',{errorMessage:'the username does not exist!'});
        return;
      };
      if(bcrypt.compareSync(thePassWord,user.password)) {
        req.session.currentUser = user;
        res.redirect('/');
      } else {
        res.render('../views/auth/log-in.hbs',{errorMessage:'Incorrect password!'})
      }
    })
    .catch(e=>{next(e)});
})

module.exports = router;