const express = require('express');
const User = require('../models/user');
const bcrypt = require("bcrypt");
const saltRounds = 10;

const router = express.Router();

router.get('/', (req, res, next) =>{
  res.render('signup')
})


router.post('/',(req, res , next) =>{
  const { username, password} = req.body;

  User.findOne({ username })
    .then(user => {
      if (user) {
        return res.render('signup', {message: 'User already created!'})
      } else {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const newUser = new User ({ username, password: hashedPassword});
        newUser.save()
          .then(() => {
            res.redirect('/login')
          })
      }
    })
    .catch(error =>{
      next(error);
    })
})

module.exports = router;