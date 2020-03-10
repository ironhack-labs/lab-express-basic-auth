const express = require('express');
const bcrypt = require('bcrypt')
const router  = express.Router();
const User = require('../models/User')

const saltRounds = 10;  //numero de saltos para encriptar

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {
  const {username, password} = req.body;
  if(username === '' || password === ''){
    res.render('signup', {error: 'No puedes dejar los campos en blanco'})
  } else{
    User.findOne({username})
    .then((user)=>{
      if(user){
        res.render('login', {error: 'Ese nombre de usuario ya existe en la BBDD'})
      } else{
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        User.create({
          username,
          hashedPassword
        }).then(()=>{
          res.redirect('/')
        })
        .catch(()=>{
          res.render('signup', {error: 'Ha ocurrido un error'})
        })
      }
    })
    .catch(next)
  }
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  const {username, password} = req.body;
  if(username === '' || password === ''){
    res.render('signup', {error: 'No puedes dejar los campos en blanco'})
  } else{
    User.findOne({username})
    .then((user)=>{
      if(!user){
        res.render('signup', {error: 'Ese nombre de usuario no existe en la BBDD'})
      } else{
        if(bcrypt.compareSync(password, user.hashedPassword)){
          req.session.currentUser = user;
          res.redirect("/");
        } else {
          res.render("login", {
            errorMessage: "Incorrect user/password"
            });
          }
        }
    })
    .then(next)
  }})

  router.get('/logout', (req, res, next) => {
    req.session.destroy(err => {
      if (err) {
        next(err);
      }
      res.redirect('/login');
    });
  });

module.exports = router;
