const express = require('express');
const router  = express.Router();
const Users = require('../models/users');
const bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {
  const {username, password} = req.body;

  if (username === "" || password === ""){
    res.render('signup', {
      errorMessage: 'Please indicate a user and password or BE DOOMED'
    });
    return;
  }
  
  Users.findOne({'username': username})
    .then(user => {
      if(user == null){
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);

        const newUser = Users({
          username, 
          password: hash
        });

        newUser.save()
          .then(user => {
            res.redirect('/');
          })
          .catch(err => {
            console.log('Errors falling from the sky: ', err);
          });
      } else {
        res.render('signup', {
          errorMessage: 'This username already exists, who do you think you are??'
        });
      }
    })
    .catch(err => {
      console.log('An error here, an error there, an error everywhere!: ', err);
      next();
    });
});

router.get('/yeet', (req, res, next) => {
  res.render('yeet');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  const {username, password} = req.body;

  if (username === "" || password === "") {
    res.render('login', {
      errorMessage: 'Please indicate a user and password to get dis'
    });
    return;
  }
  
  Users.findOne({'username': username})
    .then(user => {
      if(user == null){
        res.render('login', {
          errorMessage: 'Username or password is not valid'
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)){
        req.session.currentUser = user;
        res.redirect('/yeet');
      } else {
        res.render('login', {
          errorMessage: 'Username or passsword is not valid'
        });
      }
      
    })
    .catch(err => {
      console.log('Right user no password who you be?: ', err);
      next();
    });
});

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.render('login', {
      errorMessage: 'Please login before attempting to view this page'
    })
  }
});

router.get('/main', (req, res, next) => {
  res.render('main');
});

router.get('/private', (req, res, next) => {
  res.render('private');
});

module.exports = router;
