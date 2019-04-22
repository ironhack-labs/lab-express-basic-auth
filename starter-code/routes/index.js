const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/main', hasAccess, (req, res) => {
  res.render('main');
});

router.get('/private', hasAccess, (req, res) => {
  res.render('private');
});

function hasAccess(req, res, next) {
  if (!req.session.currentUser) {
    res.redirect('/users/login');
    return;
  }
  next();
}

module.exports = router;
