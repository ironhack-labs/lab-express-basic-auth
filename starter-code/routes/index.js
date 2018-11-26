const express = require('express');
const router = express.Router();

/* GET home page */

const isLogged = (req, res, next) => {
  const user = req.session.currentUser;
  if (!user) return res.redirect('/auth/login');
  else next();
}

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/profile', isLogged, (req, res) => {
  const user = req.session.currentUser;
  res.render('profile', user);
})

router.get('/main', isLogged, (req, res) => {
  res.render('main');
});

router.get('/private', isLogged, (req, res) => {
  res.render('private');
});



module.exports = router;