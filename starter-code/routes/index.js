const express = require('express');
const router  = express.Router();
const bcrypt = require("bcrypt"); // intro to bcrypt hashing algorithm https://www.youtube.com/watch?v=O6cmuiTBZVs
const UserModel = require("../models/User.model.js");
const protectRoute = require("../middlewares/protectRoute.js");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

/* GET register page */
router.get('/register', (req, res, next) => {
  res.render('register');
});

/* POST register page */
router.post('/register', (req, res, next) => {
  const newUser = {
    username : req.body.username,
    password : req.body.password
  }

  if (!newUser.username || !newUser.password) {
    req.flash("error", "You need to fill a username AND a password");
    res.redirect("/register");
    return;
  }

  UserModel
    .findOne({ username: newUser.username })
    .then(dbRes => {

      // Username already in DB
      if (dbRes) {
        req.flash("error", "Username is not available");
        return res.redirect("/register")
      }

      // Encrypt password
      newUser.password = bcrypt.hashSync(newUser.password, bcrypt.genSaltSync(10));

      UserModel
        .create(newUser)
        .then(() => {
          req.flash("success", "Successfully logged in")
          res.redirect("/")
        })
        .catch(next);
    })
    .catch(next);

});

/* GET login page */
router.get('/login', (req, res, next) => {
  res.render('login');
});

/* POST login page */
router.post('/login', (req, res, next) => {

  const user = {
    username : req.body.username,
    password : req.body.password
  }

  if (!user.username || !user.password) {
    req.flash("error", "Wrong credentials");
    return res.redirect("/login");
  }

  UserModel
    .findOne({ username: user.username })
    .then(dbRes => {

      // No user found with this username
      if (!dbRes) {
        req.flash("error", "Wrong credentials");
        return res.redirect("/login");
      }

      // If user password matches the one in DB
      if (bcrypt.compareSync(user.password, dbRes.password)) {

        req.session.currentUser = { ...dbRes._doc };
        delete req.session.password;

        req.flash("success", "Successfully logged in");
        return res.redirect("/");

      } else {
        req.flash("error", "Wrong credentials");
        return res.redirect("/login");
      }

    })
    .catch(next);

});

/* GET main page */
router.get('/main', (req, res, next) => {
  res.render('main');
});

/* GET private page */
router.get('/private', protectRoute, (req, res, next) => {
  res.render('private');
});

/* GET logout route */
router.get('/logout', protectRoute, (req, res, next) => {
  req.session.destroy(() => {
    res.locals.isLoggedIn = undefined;
    res.redirect('/');
  });
});


module.exports = router;
