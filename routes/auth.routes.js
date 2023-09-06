const { Router } = require("express");
const router = new Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const User = require("../models/User.model");

const mongoose = require("mongoose");

// GET route ==> to display the signup form to users

router.get("/signup", (req, res) => res.render("auth/signup"));

router.get("/userProfile", (req, res) => {
  res.render("users/user-profile", { userInSession: req.session.currentUser });
});

// POST route ==> to process form data

router.post("/signup", (req, res) => {
  console.log("The form data:", req.body);

  const { username, password } = req.body;

  if (!username || !password) {
    res.render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username and password.",
    });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render("auth/signup", {
      errorMessage:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      // console.log(`Password hash: ${hashedPassword}`);
      return User.create({
        username,
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDB) => {
      //   console.log(`Newly created user is: ', userFromDB`);
      res.redirect("/userProfile");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        console.log(" Username needs to be unique. Username is already used. ");

        res.status(500).render("auth/signup", {
          errorMessage:
            "Username needs to be unique. Username is already used.",
        });
      } else {
        next(error);
      }
    }); // close .catch()
});

router.get("/login", (req, res) => res.render("auth/login"));

router.post("/login", (req, res) => {
  console.log("SESSION =====> ", req.session);

  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("/auth/login", {
      errorMessage: "Please enter both username and password to login",
    });
    return;
  }
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        console.log("Username not registered.");
        res.render("auth/login", {
          errorMessage: "User not found and/or incorrect password.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        // res.render('users/user-profile', { user });
        req.session.currentUser = user;
        res.redirect("/userProfile");
      } else {
        console.log("Incorrect password.");
        res.render("auth/login", {
          errorMessage: "User not found and/or incorrect password.",
        });
      }
    })
    .catch((error) => next(error));
});

// Main route (protected)
router.get("/main", (req, res) => {
  if (req.session.currentUser) {
    // User is logged in, allow access to the protected route and render the main page
    res.render("auth/main", { userInSession: req.session.currentUser });
  } else {
    // User is not logged in, redirect to the login page
    res.redirect("/login"); // Adjust the login route as per your application
  }
});

// Private route (protected)
router.get("/private", (req, res) => {
  if (req.session.currentUser) {
    // User is logged in, allow access to the protected route and render the main page
    res.render("auth/private", { userInSession: req.session.currentUser });
  } else {
    // User is not logged in, redirect to the login page
    res.redirect("/login"); 
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
