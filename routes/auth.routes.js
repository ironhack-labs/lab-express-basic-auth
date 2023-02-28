const { Router } = require("express");
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const router = new Router();
const User = require("../models/User.model");

const saltRounds = 10;

router.get("/signup", (req, res) => res.render("auth/signup"));

router.get('/userProfile', (req, res) => {
  res.render('auth/user-profile', { userInSession: req.session.currentUser });
});

router.get('/login', (req, res) => res.render('auth/login'));

//POST
router.post("/signup", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.render("auth/signup", {
        errorMessage: "All fields are mandatory. Please provide your username and password.",
      });
      return;
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({
      username,
      password: hashedPassword,
    });

    res.redirect("/userProfile");
  } catch (err) {
    next(err);
  }
});

//POST login route
router.post('/login', (req, res, next) => {
  console.log('SESSION =====> ', req.session);

  const { email, password } = req.body;

  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.',
    });
    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.render('auth/login', {
          errorMessage: 'Email is not registered. Try with other email.',
        });
        return;
      } else if (bcrypt.compareSync(password, user.password)) {
        //******* SAVE THE USER IN THE SESSION ********//
        req.session.currentUser = user;
        res.redirect('/userProfile');
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch((error) => next(error));
});

//POST logout route
router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect('/');
  });
});

module.exports = router;
