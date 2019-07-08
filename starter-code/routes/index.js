const express = require('express');
const router  = express.Router();
const User = require('../model/User');
const bcrypt = require('bcrypt');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('./user/signup');
});

router.post('/signup', (req, res, next) => {
  const {username, password} = req.body;
  if(username === '' || password === '') {
    res.render('./user/signup', {errorMessage: 'Preenche, PORRA!'});
    return;
  } 

  User.findOne({user: username})
  .then((checkUser) => {
    if(checkUser !== null) {
      res.render('./user/signup', {errorMessage: 'Já existe, Ô CARALHO'});
      return;
    }

    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    User.create({user: username, password: hash})
    .then(() => res.render('./user/signup', {errorMessage: 'Mas cê é um lindo, em? Tudo feito!'}))
    .catch(err => console.log(err));

  })
  .catch(err => console.log(err));
});

router.get('/login', (req, res, next) => {
  res.render('./user/login');
});

router.post('/login', (req, res, next) => { 
  const {username, password} = req.body;
  if(username === '' || password === '') {
    res.render('./user/login', {errorMessage: 'Preenche, PORRA!'});
    return;
  } 

  User.findOne({user: username})
  .then(user => {
    if(!user) {
      res.render("./user/login", {
        errorMessage: "The username doesn't exist, porra."
      });
      return;
    }

    if(bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect('main');
    } else {
      res.render("./user/login", {
        errorMessage: "TÔ COM CARA DE OTÁRIO? PASSWORD ERRADO, MERMÃO!"
      });
    }
  })
  .catch(err => console.log(err));
});

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next(); 
  } else {                          
    res.redirect("/login");         
  }                                 
});

router.get('/main', (req, res, next) => {
  res.render('main');
});

router.get('/private', (req, res, next) => {
  res.render('private');
});

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/login");
  });
});


module.exports = router;
