const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const User = require('../models/User.model')

// .get() route ==> to display the signup form to users
router.get('/signup', (req, res) => res.render('auth/signup'));

// .post() route ==> to process form data
router.post('/signup', (req, res, next) => {
    const { username, email, password } = req.body;
   
    bcryptjs
      .genSalt(saltRounds)
      .then(salt => bcryptjs.hash(password, salt))
      .then(hashedPassword => {
        return User.create({
          // username: username
          username,
          email,
          // passwordHash => this is the key from the User model
          //     ^
          //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
          passwordHash: hashedPassword
        });
      })
      .then(userFromDB => {
        console.log('Newly created user is: ', userFromDB);
        res.redirect('/userProfile');
    })
      .catch(error => next(error));
  });
  router.get('/userProfile', (req, res) => res.render('users/user-profile'));
// login
router.get('/login', (req, res) => res.render('auth/login'));
router.post("/login", async (req, res) => {
    try {
        const { password, email } = req.body;
        const hasMissingCredential = !password || !email;
    if (hasMissingCredential) {
      return res.send("credentials missing");
    }
      const user = await User.findOne({ email });
      if (!user) {
        return res.send("user does not exist");
      }
      const verifyPassword = await bcryptjs.compare(password, user.hashPassword);
      if (!verifyPassword) {
        return res.send("wrong credentials");
      }
      return res.send("login succesfull");
    } catch (err) {
      console.log(err);
    }
  })

  module.exports = router;
