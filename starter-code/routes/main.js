const express = require('express');
const bcrypt = require('bcrypt')
const router  = express.Router();



router.get('/', (req, res, next) => {
  res.render('main');
});



module.exports = router;