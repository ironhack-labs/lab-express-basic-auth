const express = require('express');
const router = express.Router();

/* GET main page */
router.get('/private', (req, res) => {
  res.render('users/private', { userLoggedIn: req.session.currentUser });
});

module.exports = router;