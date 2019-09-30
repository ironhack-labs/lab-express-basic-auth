const express = require('express');
const router  = express.Router();

const isAuth = (req, res, next) => {
  const { currentUser: user } = req.session;
  if(user) next();
  else res.redirect('/login');
}

router.get('/', isAuth, (req, res, next) => {
  const { currentUser: user } = req.session;
  res.render('index', { user });
});

router.get('/main', isAuth, (req, res, next) => {
  const { currentUser: user } = req.session;
  res.render('main', { user });
});

router.get('/private', isAuth, (req, res, next) => {
  const { currentUser: user } = req.session;
  res.render('private', { user });
});

module.exports = router;
