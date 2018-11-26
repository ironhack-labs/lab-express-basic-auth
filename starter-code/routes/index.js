const express = require('express');
const router  = express.Router();

/* GET home page */

const isLogged = (req, res, next) => {
  const user = req.session.currentUser;
  if (!user) return res.redirect('/auth/login');
  else next();
}

router.get('/main', (req, res, next) => {
  res.render('main');
});

router.get('/profile', isLogged, (req, res) => {
  const user = req.session.currentUser;
  res.render('profile', user);
})

router.get('/private', isLogged, (req, res) => {
  const user = req.session.currentUser;
  res.render('private', user);
})



module.exports = router;
