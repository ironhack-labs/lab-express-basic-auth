const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', {loggedin: req.session.user});
});

module.exports = router;
