var express = require('express');
var router = express.Router();

// GET '/login'
router.get('/', (req, res, next) => {
  res.render('login');
});

// GET "/login"
router.post("/", (req, res, next) => {
  res.redirect('/');
})

module.exports = router;