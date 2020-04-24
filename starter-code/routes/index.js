const express = require('express');
const router  = express.Router();

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
  }
}

router.get('/profile', loginCheck(), (req, res) => {
  console.log('this is the cookie: ', req.cookies);
  res.cookie('myCookie', 'jan');
  console.log('this is the user id: ', req.session.user._id);
  res.render('profile');
})


router.get('/main', loginCheck(), (req, res) =>{
console.log('This is the cookie:', req.cookies);
res.cookie('myCookie', '{{username}}');
console.log('this is the user id:', req.session.user_id);
res.render('main');
})

router.get('/private', loginCheck(), (req, res) =>{
  console.log('This is my cookie:', req.cookies);
  res.cookie('myCookie', '{{username}}');
  console.log('this is the user id:', req.session.user_id);
  res.render('private');
})
module.exports = router;
