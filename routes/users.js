const express = require('express');
const router = express.Router();
//const requireAuth = require('')

router.get('/profile', (req, res, next) => {
  res.render('profile.hbs', { userInSession: req.session.currentUser });
});

module.exports = router;
