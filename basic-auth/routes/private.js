var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    const data = {
        user: req.session.currentUser.username
    };
  res.render('private/private', data);
});

module.exports = router;
