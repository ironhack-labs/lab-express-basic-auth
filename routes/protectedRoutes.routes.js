const express = require('express');
const router = express.Router();
const protectedRoute = require('../middlewares/protectedRoutes');

/* GET home page */
router.use(protectedRoute);

router.get('/main', (req, res, next) => {
  res.render('protected-views/main', { loggedUser: req.session.currentUser });
});

router.get('/private', (req, res, next) => {
  res.render('protected-views/private');
});

module.exports = router;
