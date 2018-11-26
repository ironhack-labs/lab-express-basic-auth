const router = require('express').Router();
const bcrypt = require('bcrypt');
const User   = require('../models/User');

const saltRounds = 10;
 
// todas estás rutas tienen antepuesto /auth 
router.get('/signup', (req, res, next) => { 
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const { username, password1, password2 } = req.body;
  if (username === '' || password1 === '' || password2 === '') {//no empty fields
    return res.render('auth/signup', {
      message: 'Please fill the fields'
    })
  }  


  if(password1 !== password2){
    return res.render('auth/signup',{
      message: "Passwords don't match"
    })
  }

  User.findOne({ username })
  .then(response => {
    if (response === null) {  
      const salt = bcrypt.genSaltSync(saltRounds);
      const password = bcrypt.hashSync(password1, salt);
      User.create({ username, password })
      .then(user => {
        res.send(user);
      })
      .catch(err => {
        console.log(err);
      })
    } else {
      res.render('auth/signup', {
        message: 'This user already exist'
      })
    }
  })
  .catch(err => {
    console.log(err);
  })
});

router.get('/login', (req, res) => {
  if (req.session.currentUser) return res.redirect('/profile');
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
      return res.render('auth/login',{
        message: 'This does not seem right 👮🏻‍♀️'
      })
    }
  })
  .catch(err => {
    console.log(err);
  })
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) res.send(err);
    else return res.redirect('/auth/login');
  })
})

module.exports = router;