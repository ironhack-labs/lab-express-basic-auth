const express = require('express');
const router = express.Router();
const app = express();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// const dbName = 'basic-auth';
// mongoose.connect(`mongodb://localhost/${dbName}`)
// .then(_ => console.log('Successfully connected to Mongo'))
// .catch(err => console.log(err));

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('../views/signup.hbs');
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashPassword = bcrypt.hashSync(password, salt);
  User.create({ username, password: hashPassword })
  .then(_ => res.redirect('/'))
  .catch(err => {
    res.render('../views/signup.hbs', { errorMessage: 'Error with username or password'});
    console.log(err);
  })
});

router.get('/login', (req, res, next) => {
  res.render('../views/login.hbs');
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({username})
  .then(user => {
    if(!user) {
      res.render('../views/login.hbs', { errorMessage: "The username doesn't exist."});
      return;
    }
    if(bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect('/');
    } else {
      res.render('../views/login.hbs', { errorMessage: "Incorrect password"});
    }
  })
  .catch(err => next(err))
});

router.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/');
  }
});

router.get('/main', (req, res, next) => {
  res.render('../views/main');
});

router.get('/private', (req, res, next) => {
  res.render('../views/private');
});

module.exports = router;
