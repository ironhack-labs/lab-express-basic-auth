// routes/auth.routes.js

const { Router } = require("express");
const router = new Router();

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const User = require("../models/User.model");

const isAuthenticated = require('../middleware/isAuthenticated');

// GET route ==> to display the signup form to users
router.get("/signup", (req, res) => res.render("auth/signup"));

// POST route ==> to process form data
router.post("/signup", (req, res, next) => {
  //   console.log("The form data: ", req.body);

  const { username, password } = req.body;

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      // console.log(`Password hash: ${hashedPassword}`);
      return User.create({
        // username: username
        username,
        email,
        // passwordHash => this is the key from the User model
        //     ^
        //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDB) => {
    //   console.log("Newly created user is: ", userFromDB);
      res.redirect('/userProfile');
    })
    .catch((error) => next(error));
});



// GET route to display the login form
router.get("/login", (req, res) => {
  res.render("auth/login"); // Make sure you create this view
});

// POST route to process the login form
router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then(user => {
      if (!user) {
        // Username not found
        res.render("auth/login", { errorMessage: "Username not found." });
        return;
      }
      // User found, now compare passwords
      if (bcryptjs.compareSync(password, user.passwordHash)) {
        // Password matches, login successful
        req.session.currentUser = user; // Save user info in session
        res.redirect("/userProfile"); // Redirect to the user profile or another protected route
      } else {
        // Password does not match
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch(error => next(error));
});


router.get('/userProfile', (req, res) => {
  if (!req.session.currentUser) {
    // If no user is logged in, redirect to the login page
    res.redirect('/login');
  } else {
    // If a user is logged in, render the user profile page
    res.render('users/user-profile', { user: req.session.currentUser });
  }
});


// Use isAuthenticated middleware to protect the /main and /private routes
// Place these AFTER your signup and login routes to keep a logical order

router.get('/main', isAuthenticated, (req, res) => {
  res.render('protected/main'); // Make sure you have a main.hbs view
});

router.get('/private', isAuthenticated, (req, res) => {
  res.render('protected/private'); // Make sure you have a private.hbs view
});


module.exports = router;
