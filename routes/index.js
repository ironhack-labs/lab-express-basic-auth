const router = require('express').Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', { loggedIn: req.session.user });
});

function loginCheck() {
  return (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.render('auth/login', { message: `You're not logged in.` });
    }
  };
}

router.get('/profile', loginCheck(), (req, res, next) => {
  const username = req.session.user.username;
  console.log(req.session);
  res.render('profile', { username: username });
});

router.get('/main', loginCheck(), (req, res, next) => {
  res.render('main', {});
});

router.get('/private', loginCheck(), (req, res, next) => {
  res.render('private', {});
});

module.exports = router;
