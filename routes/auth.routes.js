const router = require("express").Router();
const bccryptjs = require('bcryptjs')
const User = require('../models/User.model')
const salt = 10;

router.get("/singup", (req, res, next) => {
  res.render("auth/singup");
});

router.post('/singup', (req,res,next) => {
  const {username, password} = req.body
  bccryptjs.gentSalt(salt)
  .then((salt) => {
    bccryptjs.hash(password, salt)})
  .then(passwordHashed => {
    User.create({
      username,
      passwordhash: passwordHashed
    })
  .then(user => {
    res.redirect('/user-profile')
    return user
  })
  })
})

router.get('/user-profile', (req,res,next) => {
  res.render('user/user-profile')
})

module.exports = router;
