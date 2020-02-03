const express = require('express');
const router  = express.Router();
const { isLogged } = require('../middleware/isLogged')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});
router.get('/profile', isLogged, profileView)

module.exports = router;
