var express = require('express');
var router = express.Router();

// GET '/logout'
router.get('/', (req, res, next) => {
  req.session.destroy( (err) => {
    console.log('YOUVE BEEN LOGGED OUT');
    res.render('auth-views/logout');
  })
});

module.exports = router;
