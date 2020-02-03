const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index');
});

router.use((req, res, next) => {
  req.session.currentUser ? next() : res.redirect('/login');
});

router.get('/main', (req, res) => {
  // console.log('Output for: req', req.session.currentUser);
  res.render('auth/main', { name: req.session.currentUser.firstName });
});
router.get('/private', (req, res) => {
  res.render('auth/private');
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    res.redirect('/login');
  });
});

module.exports = router;
