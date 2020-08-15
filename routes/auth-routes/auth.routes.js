const express = require("express");
 const router = express.Router();
 const bcryptjs = require("bcryptjs");
 const saltRounds = 10;
 const User = require("../../models/User.model");
 const mongoose = require('mongoose');


 //IT 1
  router.get("/signup", (req, res, next) => {
 	res.render("auth-views/signup");
 });

  router.post("/signup", (req, res, next) => {
 	const { username, password } = req.body;

  	if (!username || !password) {
 		res.render("auth-views/signup", {
 			errorMessage: "All fields are mandatory. Please insert your Username and Password",});
        return
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
 		.then((salt) => bcryptjs.hash(password, salt))
 		.then((hashedPassword) => {
            return User.create({
 				username,
 				passwordHash: hashedPassword,
 			});
 		})
         .then((userFromDB) =>
          console.log('Newly created user is: ', userFromDB))
          res.redirect('/userProfile');
        })
 		.catch(err => {
            if (error instanceof mongoose.Error.ValidationError) {
                res.status(500).render('auth/signup', { errorMessage: error.message });
              } else if (error.code === 11000) {
                res.status(500).render('auth/signup', {
                  errorMessage: 'Username need to be unique. Username is already used.'
                });
              } else {
                next(error);
              }
        }); 
});


//IT 2

router.get('/login', (req, res) => res.render('auth-views/login'));

router.post('/login', (req, res, next) => {
  console.log('SESSION =====> ', req.session);
  const { username, password } = req.body;

  if (username === '' || password === '') {
    res.render('auth-view/login', {
      errorMessage: 'Please enter both, username and password to login.'
    });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (!user) {
        res.render('auth-views/login', { errorMessage: 'Usrname is not registered. Try with other username.' });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
       
        // res.render('user-views/userProfile', { user });

        req.session.currentUser = user;
        res.redirect('/auth/userProfile');
      } else {
        res.render('auth-views/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});

router.get("/userProfile", (req, res) => {
    res.render("user-views/userProfile", { userInSession: req.session.currentUser });
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

  module.exports = router;