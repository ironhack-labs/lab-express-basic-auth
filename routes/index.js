const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

const loginCheck = () => {
  return (req, res, next) => {
    // if the user is logged in proceed with the next step
    if (req.session.user) {
      next();
    } else {
      // else redirect to login
      res.redirect('/login');
    }
  }
}



router.get('/login', loginCheck(), (req, res, next) => {
  if (req.session.user) {
    res.redirect("/dashboard")
 }  else {
  res.render('login');
}
});

router.get('/signup', loginCheck(), (req, res, next) => {
  if (req.session.user) {
    res.redirect("/")
 }  else {
  res.render('signup');
 }
});

router.get('/dashboard', loginCheck(), (req, res, next) => {
  console.log('this is the user: ', req.cookies);
  // console.log('this is the user: ', req.session.cookie);
  res.render('dashboard', {user: req.session.user});
});

router.get('/main', loginCheck(), (req, res, next) => {
  console.log('this is the user: ', req.cookies);
  // console.log('this is the user: ', req.session.cookie);
  res.render('main', {user: req.session.user});
});

router.get('/private', loginCheck(), (req, res, next) => {
  console.log('this is the user: ', req.cookies);
  // console.log('this is the user: ', req.session.cookie);
  res.render('private', {user: req.session.user});
});

router.get('/logout', (req, res) => {
  req.session.destroy(error => {
    if (error) {
      next(error);
    } else {
      res.redirect('/');
    }
  })
})

module.exports = router;
