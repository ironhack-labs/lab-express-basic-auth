const express = require('express');
const bcrypt = require('bcrypt');

const User = require("../models/user-model.js")

const router  = express.Router();

router.get('/signup', (req, res, next) => {
  res.render('auth-views/signup-form.hbs');
})

// encrypt the submitted password before saving
router.post('/process-signup', (req, res, next) => {
  const { username, originalPassword } = req.body;
  
  if (!originalPassword){
      req.flash("error", "Password can't be blank");
      res.redirect("/signup");
      return;
    }

    User.findOne({username : {$eq : username}})
      .then(data => {
        if(data){
          req.flash("error", "This username is already used by someone");
          res.redirect("/signup");
          return;
        }

        const encryptedPassword = bcrypt.hashSync(originalPassword, 10);

        User.create({ username, encryptedPassword })
          .then( data => {
            res.redirect("/");
          })
          .catch(err => next(err))
      })
      .catch(err=>next(err))

})

router.get('/login', (req, res, next) => {
  res.render('auth-views/login-form.hbs');
})

// encrypt the submitted password before saving
router.post('/process-login', (req, res, next) => {
  const { username, originalPassword } = req.body;

  User.findOne( {username: {$eq: username}} )
  .then(data => {
    if (!data){
      req.flash("error", "Incorrect username")
      res.redirect("/login")
      return;
    }

    // check password
    const { encryptedPassword } = data;
    if(!bcrypt.compareSync(originalPassword, encryptedPassword)){
      req.flash("error", "Incorrect Password!")
      res.redirect("/login")
    } else {
      req.flash("success", "Log in success!")
      res.redirect("/")
    }
  })
  .catch(err => next(err))
})


module.exports = router;