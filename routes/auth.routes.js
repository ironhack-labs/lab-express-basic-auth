const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

router.get('/signup', isLoggedOut, (req, res) => res.render('auth/signup'));

router.post('/signup', isLoggedOut, (req, res, next) => {
    console.log('The form data: ', req.body);

    const { username, password } = req.body;

    if (!username || !password) {
        res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
    }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }

    bcryptjs
      .genSalt(saltRounds)
      .then(salt => bcryptjs.hash(password, salt))
      .then(hashedPassword => {
        console.log(`Password hash: ${hashedPassword}`);

        return User.create({
            username,
            passwordHash: hashedPassword
        });
      })
      .then(userFromDb => {
        res.redirect('/userProfile');
      })
      .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
          res.status(500).render('auth/signup', { errorMessage: error.message });
        } else if (error.code === 11000) {
   
          console.log(" Username need to be unique ");
   
          res.status(500).render('auth/signup', {
             errorMessage: 'User not found and/or incorrect password.'
          });
        } else {
          next(error);
        }
      }); 
  });

router.get('/login', isLoggedOut, (req, res) => res.render('auth/login'));

router.post('/login', isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;

  console.log('Session:', req.session);

  User.findOne({ username })
    .then(user => {
      if (!user) {
        console.log("Username doesn't exist. ");
        res.render('auth/login', { errorMessage: 'User not found and/or incorrect password.' });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user.toObject();  
        delete req.session.currentUser.password;
        res.redirect('/userProfile');
      } else {
        console.log("Incorrect password. ");
        res.render('auth/login', { errorMessage: 'User not found and/or incorrect password.' });
      }
    })
    .catch(error => next(error));
});

router.get("/logout", isLoggedIn, (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).render("auth/logout", { errorMessage: err.message });
        return;
      }
  
      res.redirect("/");
    });
  });

router.get('/userProfile', isLoggedIn, (req, res) => {
    res.render('users/user-profile', { userInSession: req.session.currentUser });
});

router.get('/main', isLoggedIn, (req, res) => {
    res.render('users/main');
});

router.get('/private', isLoggedIn, (req, res) => {
    res.render('users/private');
});

module.exports = router;