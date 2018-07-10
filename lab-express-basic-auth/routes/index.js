const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));

/* GET home page. */
router.get('/', function (req, res, next) {
  const user = { user: req.session.currentUser };
  res.render('index', user);
});

module.exports = router;
