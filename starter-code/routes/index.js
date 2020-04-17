const express = require('express');
const router = express.Router();
// const bcrypt = require('bcrypt')
// const bcryptSalt = 10

/* GET home page */

router.get('/', (req, res, next) => {
  res.render('index');
});


// privada

router.use((req, res, next) => req.session.currentUser ? next() : res.redirect('/auth/login'))
router.get('/profile', (req, res, next) => res.render('profile', req.session.currentUser))


module.exports = router;
