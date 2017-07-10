
const express = require('express');
const router = express.Router();

const protectionChecker = function(req, res, next) {
    if (req.session.currentUser) {
      next();
    } else {
      res.redirect('/login');
    }
}

router.get('/', (req, res, next) => {
  res.render('index');
})

router.get('/main', (req, res, next) => {
  res.render('main');
})

router.get('/private', protectionChecker, (req, res, next) => {

  res.render('private');

})
module.exports = router;
