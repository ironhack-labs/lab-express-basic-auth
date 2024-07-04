const router = require("express").Router();
const bcryptjs = require('bcryptjs');
const User = require('../models/User.model')
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');
const saltRounds = 10;


/* GET home page */
router.get("/signup",isLoggedOut, (req, res, next) => {
  res.render("auth/signup");
});

router.post('/signup',isLoggedOut, (req, res, next) => {
  const { username, email, password } = req.body;
 
  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        username,
        email,
        passwordHash: hashedPassword
      });
    })
    .then(userFromDB => {
      /* console.log('Newly created user is: ', userFromDB); */
      res.redirect(`/userProfile`);
    })
    .catch(error => next(error));
});

router.get('/userProfile',isLoggedIn, (req, res) => {
  console.log('req.session', req.session)
  res.render('auth/user', {user: req.session.currentUser})
});

router.get('/login',isLoggedOut, (req, res, next) => {
  res.render("auth/login")
});

router.post('/login',isLoggedOut, (req, res, next) => {
  console.log('SESSION =====> ', req.session);
  const { email, password } = req.body;
  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }
  User.findOne({ email })
    .then(user => {
      if (!user) {
        console.log("Email not registered. ");
        res.render('auth/login', { errorMessage: 'User not found and/or incorrect password.' });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect('/userProfile');
      } else {
        console.log("Incorrect password. ");
        res.render('auth/login', { errorMessage: 'User not found and/or incorrect password.' });
      }
    })
    .catch(error => next(error));
});

router.post('/logout',isLoggedIn, (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});



module.exports = router;