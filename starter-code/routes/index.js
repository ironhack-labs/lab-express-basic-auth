const express = require('express');
const router = express.Router();
// const bcrypt = require('bcrypt')
// const bcryptSalt = 10

/* GET home page */

router.get('/', (req, res, next) => {
  res.render('index');
});


// router.post('/signup',)


module.exports = router;
