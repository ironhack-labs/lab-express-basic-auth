const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  const { user } = req.session; 
  res.render('index', { user });
});

const userShouldBeAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/signup'); 
  }
  next(); 
}

router.get('/main', userShouldBeAuth, (req, res) => {
  res.render('main');
});

router.get('/private', userShouldBeAuth, (req, res) => {
  res.render('private');
})

module.exports = router;
