const { Router } = require('express');
const router = new Router();

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const User = require('../models/User.model');
 
// .get() route ==> to display the signup form to users
router.get('/signup', (req,res) =>  res.render("./auth/signup"))
 
// .post() route ==> to process form data
router.post('/signup', (req, res, next) => {
    const {Username, Password} = req.body

    bcryptjs
    .genSalt(saltRounds)
    .then(salt => 
         bcryptjs.hash(Password,salt))
    .then(hashedPassword => {
        return User.create({
            Username,
            Password : hashedPassword
        })
        .then(userFromDB => {
            res.redirect("/userprofile")
          })
          .catch(error => next(error));
    }) 

    if (!Username || !Password){
        res.render("./auth/signup", {
            Username,
            Password,
            errorMessage: "All fields are mandatory. Please provide your username, email and password.",
        })
        return;
    }

  });

  router.get('/userProfile', (req, res) => res.render('users/user-profile'));

module.exports = router;