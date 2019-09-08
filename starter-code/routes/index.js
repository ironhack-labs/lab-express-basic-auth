const express = require('express');
const router  = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

 //Metodos para cargar la informacion entre las vistas y mongoose
 router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', async (req, res, next) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(0);
  const hashedPassword = bcrypt.hashSync(password, salt);
  const user = await User.create({
    username,
    password: hashedPassword
  });
  res.redirect('/login');
});

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    res.render('auth/login', {
      err: "User doesn't exist"
    });
  }
  if (bcrypt.compareSync(password, user.password)) {
    req.session.loggedUser = user;
    req.app.locals.loggedUser = user;
    res.redirect('/main');
  } else {
    res.render('auth/login', {
      err: 'Authorization Error'
    });
  }
});

router.get('/main', isLoggedIn, (req, res, next) => {
  const { loggedUser } = req.app.locals;
  res.render('auth/main', loggedUser);
});

router.get('/private', isLoggedIn, (req, res, next) => {
  const { loggedUser } = req.app.locals;
  res.render('auth/private', loggedUser);
});

function isLoggedIn(req, res, next) {
  if (req.session.loggedUser) {
    next();
  } else {
    res.redirect('/login');
  }
}


module.exports = router;
