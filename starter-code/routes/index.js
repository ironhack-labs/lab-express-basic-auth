const express = require('express');
const router  = express.Router();
const mongoose     = require('mongoose');
const user = require('../models/models.js')

const bcrypt = require('bcryptjs');


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.post('/signUp', (req, res) =>{
  if (req.body.userName === '' || req.body.userPass === ''){
    res.send('Completa el formulario')
  } else {
  const salt = bcrypt.genSaltSync(10);
  req.body.userPass = bcrypt.hashSync(req.body.userPass, salt);
  
  user.findOne({userName: req.body.userName})
  .then( (a) => {
    if (a === null){
      user.create(req.body)
      .then((user) => {
        req.session.currentUser = "user";
        res.redirect("/main");
      })
      .catch( (err) => {
        console.error("Te has columpiado", err)
      })
    }
  })
  .catch( (err) => {
    console.error("Fatal Error", err)
  })
  }
})


router.get('/login', (req, res, next) => {
  req.session.destroy((err) => {
  });
  res.render('login')
});


router.post('/login', (req, res) => {

  user.findOne({userName: req.body.userName})
  .then((userSearched) => {
  
    if (bcrypt.compareSync(req.body.userPass, userSearched.userPass)){
      
      req.session.currentUser = "user";
      console.log(req.session)
      res.redirect("/main");
    } else {
      console.log("No me trolees")
    }
  })
  .catch( (err) => {
    console.error("Fatal Error", err)
  })
})

router.use((req, res, next) => {
  console.log(req.session)
  if (req.session.currentUser) {
    next()
  } else {
    res.redirect("/login");
  }
});

router.get('/main', (req, res) => {
  res.render('main')
})

router.get('/private', (req, res) => {
  res.render('private')
})




module.exports = router;
