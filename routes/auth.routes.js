const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
// .get() route ==> to display the signup form to users
router.get('/signup', (req, res) => res.render('auth/signup'));
// .post() route ==> to process form data
router.post('/signup', (req, res) => {
    //console.log('The form data: ', req.body);
    const { username, email, password } = req.body;
    bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password,salt))
    .then(hashedPassword => {
        return User.create({
            username,
            email,
            passwordHash: hashedPassword
        });
    })
    .then(userFromDB => {
        console.log(`Newly created user is: `,userFromDB);
    })
    .catch(error => (error));
  });
 
module.exports = router;