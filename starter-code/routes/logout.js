var express = require('express');
var router = express.Router();

// GET '/logout'
router.get('/', (req, res, next) => {
  //to logout ---> destroy the cookie
  req.session.destroy( (err) => {
    res.redirect('/');
  })
});

module.exports = router;