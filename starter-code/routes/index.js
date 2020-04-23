const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

const loginCheck = () => {
  return (req, res, next) => {
    if(req.session.user) {
      console.log('user logged in');
      next();
    } else {
      res.redirect('login');
    }
  };
};

router.get('/profile', loginCheck(), (req, res) => {
  console.log('this is the cookie: ', req.cookies);
  res.cookie();
  console.log('this is the user id: ', req.session.user._id);
  const usernameUpperCase = req.session.user.username[0].toUpperCase() + req.session.user.username.slice(1);
  res.render('profile', {username: usernameUpperCase});
});

router.get('/main', loginCheck(), (req, res) => {
  res.render('main');
});

module.exports = router;
