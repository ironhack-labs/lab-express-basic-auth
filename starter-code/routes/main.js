const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  if(req.session.currentUser) {
    next();
  }
  else {
    res.redirect('/login');
  }
})

router.get('/main', (req, res, next) => {
  res.render('private/main');
})


router.get('/private', (req, res, next) => {
  res.render('private/private');
})


router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
  res.redirect('/login')
  })
})


module.exports = router;
