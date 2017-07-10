const express = require('express');
const router = express.Router();

function auth(req, res, next) {
  if(req.session.currentUser) {
    next();
  } else {
    res.redirect('/');
  }
}

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/main', auth, (req, res, next) => {
  res.render('main');
});

router.get('/private', auth, (req, res, next) => {
  res.render('private');
});

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/login');
  });
});

module.exports = router;
