const router = require('express').Router();

// for pages that are only available if logged
const loginCheck = () => {
  return (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.redirect('/login');
    }
  };
};

// rewriting the original
router.get('/', (req, res, next) => {
  res.render('index', {
    username: req.session.user ? req.session.user.username : false,
  });
});

router.get('/hello', (req, res, next) => {
  res.render('hello', {
    username: req.session.user ? req.session.user.username : false,
  });
});

router.get('/private', loginCheck(), (req, res, next) => {
  res.render('private', { username: req.session.user.username });
});

module.exports = router;
