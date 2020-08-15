const express = require('express');
const router = express.Router();

/* GET main page */
router.get('/main', (req, res) => {
  res.render('users/main', { userLoggedIn: req.session.currentUser });
});

module.exports = router;