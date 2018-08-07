const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = require('../models/user');

/*Sign up*/
router.get('/signup'), (req, res) => {
  const data = {message: req.flash('info')};
  res.render('/signup', data)
}

router.post('/signup', (req, res, next) => {
  const {username, password} = req.body;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);

  if (!username || !password){
    req.flash('info', 'The fields can\'t be empty joder!');
    res.redirect('/signup')
  }
  else {
    User.create({
      username,
      password: hashedPassword,
    })
    .then((newUser) => {
      req.flash('info', 'A new toy user have been created!');
      res.redirect('/');
    })
    .catch((error) => {
      next(error)
    })
  }
})

/*Log in*/
router.get('/login', (req, res) => {
  const data = {message: req.flash('info')};
  res.render('/login', data)
})

router.post('/login', (req, res, next) => {
  const {username, password} = req.body;
  if (!username || !password){
    req.flash('info', 'The fields can\'t be empty');
    res.redirect('/login');
  }
  else {
    User.findOne({username})
    .then (user => {
      if(user){
        if(bcrypt.compareSync(password, user.password)){
          req.session.currentUser = user;
          res.redirect('/')
        }
        else{
          req.flash('info', 'Your username or password is incorrect Muajajaja');
          res.redirect('login');
        }
      }
      else {
        req.flash('info', 'Your username or password is incorrect man!');
        res.redirect('login')
      }
    })
    .catch(error => {
      next(error);
    })
  }
})

module.exports = router;