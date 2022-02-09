const router = require('express').Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

function loginCheck() {
  return (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.redirect('/login', { message: `You're not logged in` });
    }
  };
}

router.get('/profile', loginCheck(), (req, res, next) => {
  const username = req.session.user.username;
  console.log(req.session);
  res.render('profile', { username: username });
});

module.exports = router;
