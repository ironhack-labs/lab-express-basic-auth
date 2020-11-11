const { Router } = require("express");
const router = new Router();

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const User = require("../models/User.model");

//to display the signup form to users
//The get method reveals that upon the get request from the user, as a response the file signup.hbs will be sent and rendered to them.
router.get('/signup', (req, res) => res.render('auth/signup'));

//defines where to send the form data when a form is submitted.
router.post('/signup', (req, res, next) => {
  console.log('The form data: ', req.body);

  bcryptjs
  .genSalt(saltRounds)
  .then(salt => bcryptjs.hash(password, salt))
  .then(hashedPassword => {
    return User.create({
        username,
        passwordHash: hashedPassword
      });
    })
    .then(userFromDB => {
      console.log('Newly created user is: ', userFromDB);
  })
  .catch(error => next(error));
});
module.exports = router;
