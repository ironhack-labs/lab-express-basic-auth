const router = require('express').Router();
const { isLoggedIn, isLoggedOut } = require('../../middleware/routes-guard');

/* GET home page */
router.get('/main', isLoggedIn, (req, res, next) => {
  res.render('users/main', { user: req.session.currentUser });
});

router.get('/private', isLoggedIn, (req, res, next) => {
  res.render('users/private', {});
});

module.exports = router;
