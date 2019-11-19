var express = require('express');
const router = express.Router();

// GET '/signup'
router.get('/', (req, res, next) => {
  res.render('auth-views/signup');
});

module.exports = router;