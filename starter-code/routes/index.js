const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', {
    loggedUser: req.session.user
  });
});



// restricted urls
const authCheck = () => {
  return (req, res, next) => {
    if (req.session.user) {
      next()
    } else {
      res.redirect('/');
    }
  }
}

router.get('/main', authCheck(), (req, res, next) => {
  res.render('main');
});

router.get('/private', authCheck(), (req, res, next) => {
  res.render('private');
});


module.exports = router;