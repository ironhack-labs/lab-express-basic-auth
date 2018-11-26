const router = require('express').Router();
const bcrypt = require('bcrypt');
const User   = require('../models/User');

const saltRounds = 8;

router.get('/signup', (req, res) => { 
  res.render('auth/signup');
});


router.post('/signup', (req, res, next) => {
  const { username, password, repassword } = req.body;
  if (username === '' || password === '' || repassword === '') {
    return res.render('auth/signup', {
      message: 'Please fill the fields'
    })
  }  
  if(password !== repassword ) {
    return res.render('auth/signup', {
      message: 'Passwords do not match'
    })
  }
  User.findOne({ username })
  .then(response => {
    if (response === null) {  
      const salt = bcrypt.genSaltSync(saltRounds);
      const passwordCryp = bcrypt.hashSync(repassword, salt);
      User.create({ username, password:passwordCryp })
      .then(user => {
        res.send(user);
      })
      .catch(e => {
        console.log(err);
      })
    } else {
      res.render('auth/signup', {
        message: 'This username already exist'
      })
    }
  })
  .catch(e => {
    console.log(err);
  })
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username })
  .then(user => {
    if (user === null) {
      return res.render('auth/login', {
        message: 'This user doesnt exist, please sign up first'
      })
    }
    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect('/profile');
    } else {
      return res.render('auth/login', {
        message: 'The Password is incorrect'
      })
    }
  })
  .catch(err => {
    console.log(err);
  })
});







module.exports = router;