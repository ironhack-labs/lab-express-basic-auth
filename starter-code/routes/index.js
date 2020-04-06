const express = require('express');
const router  = express.Router();
const User = require('../model/user');
const bcrypt = require('bcrypt');
const saltRound = 10;

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('signup-form');
});

router.post('/signup', (req, res, next) => {
  const {
    username,
    password
  } = req.body

  errorMessage = 'Este nome de usuário já existe'

  if(username === '' || password === '') {
    res.redirect('/signup')
    console.log('voltou');
    return
  }
  const salt = bcrypt.genSaltSync(saltRound)
  const hashpass = bcrypt.hashSync(password, salt)
  User
  .create({
    username, 
    password:hashpass
  })
  .then(response => {
    req.session.currentUser = response
    res.redirect('/')
  })
  .catch(error => {
    res.render('signup-form', {errorMessage})
  })
})

router.get('/login', (req, res, next) => {
  res.render('login-form');
});

router.post('/login', (req, res, next) => {
  const {
    username,
    password
  } = req.body

  errorMessage = 'Nome de usuário ou senha incorreto'

  if(username === '' || password === '') {
    res.redirect('/login')
    console.log('voltou');
    return
  }
  User
  .findOne({username})
  .then(response => {
    if(!response) {
      res.send('usuario não existe')
    }
    if(bcrypt.compareSync(password, response.password)){
      req.session.currentUser = response
      res.redirect('/')
    } else {
      es.render('login-form', {errorMessage})
    }
  })
  .catch(error => {
    res.render('login-form', {errorMessage})
  })
})

router.use((req, res, next) => {
  if(req.session.currentUser){
    next();
  } else {
    res.redirect('/login')
  }
})

router.get('/main', (req, res, next) => {
  res.render('main')
})

router.get('/private', (req, res, next) => {
  res.render('private')
})


module.exports = router;
