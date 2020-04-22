const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

const loginCheck = () => {
  return (req, res, next) => {
    if (req.session.user) {
      console.log('user logged in');
      next();
    } else {
      res.redirect('login');
    }
  };
};

router.get('/private', loginCheck(), (req, res) => {
  console.log('this is the cookie: ', req.cookies);
  res.cookie('myCookie', 'jan');
  console.log('this is the user id: ', req.session.user._id);
  res.render('private');
});

module.exports = router;
