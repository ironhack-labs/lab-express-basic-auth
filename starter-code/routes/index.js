const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const router = express.Router();
const User = require('../models/User');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(session({
  secret: 'basic-auth-secret',
  cookie: {
    maxAge: 60000,
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60, // 1 day

  })
}))

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => res.render('signup'));

router.post('/signup', (req, res, next) => {
  const saltRounds = 5;

  const genericUser = new User();

  const myUser = req.body.username;

  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);

  if (myUser == "" || hashedPassword == "") res.redirect('/signup');

  genericUser.username = myUser;
  genericUser.password = hashedPassword;

  genericUser.save()
    .then(() => {
      console.log(req.session.InSession);
      req.session.InSession = true;
      res.redirect('/');
    })
});

router.get('/login', (req, res, next) => res.render('login'));

router.post('/login', (req, res, next) => {
  if (req.body.username == "" || req.body.password == "") res.redirect('/login');
  User.findOne({
    username: req.body.username
  })
    .then((found) => {
      const matches = bcrypt.compareSync(req.body.password, found.password)

      if (matches) {
        req.session.InSession = true;
        req.session.user = req.body.username;
        res.redirect('/')
      } else {
        req.session.InSession = false;
        res.redirect('/login');
      }
    })
})

module.exports = router;
