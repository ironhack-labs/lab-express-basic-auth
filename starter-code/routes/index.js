const express = require('express');
const router  = express.Router();
const User = require('../models/User')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next)=>{
  let user = req.body.username
  let password = req.body.password

  // let hashedPass = encryptionMiddleware(password)

  User.create( { "user": user, "password": password } )
    .then(data => {
      console.log(data)
    })
    .catch(error => {
      res.redirect('../views/error.hbs')
    })
  console.log(req)
})

router.get('/welcome', (req, res, next) => {
  res.render('index');
});



module.exports = router;
