const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { Router } = require("express");
const User = require("../models/User.model");

const router = new Router();
const saltRounds = 10;

// 2. GET route ==> to display the signup form to users.
router.get("/signup", (req, res) => res.render("auth/signup"));

// 3. POST route ==> to process form data (don't forget to hash the password with bcrypt ;{ )
router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  console.log(username, password);
  // Validate that incoming data is not empty.
  if (!username || !password) {
    res.render("auth/signup", {
      username,
      errorMessage:
        "All fields are mandatory. Please provide your name, email and password.",
    });
    return;
  }

  // Strong password pattern.
  const strongPasswordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

  // Validate that incoming password matches regex pattern.
  if (!strongPasswordRegex.test(password)) {
    res.status(500).render("auth/signup", {
      username,
      errorMessage:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  // First use bcrypt to hash incoming password
  bcrypt
    .hash(password, saltRounds)
    // Create new user with the hashed password
    .then((hashedPassword) => {
      console.log("USER CREATING: ", username, hashedPassword);
      User.create({ username, password: hashedPassword })

        .then((newUser) => {
          // add user to session.
          req.session.user = newUser;

          // redirect to user profile.
          res.redirect("/user-profile");
        })
        .catch((error) => {
          if (error instanceof mongoose.Error.ValidationError) {
            res.status(500).render("auth/signup", {
              username,
              validationError: error.message,
            });
          } else if (error.code === 11000) {
            console.log(error);
            res.status(500).render("auth/signup", {
              username,
              errorMessage: "Username needs to be unique. Already in use.",
            });
          } else {
            next(error);
          }
        });
    })
    .catch((err) => next(err));
});

// 4. GET route ==> to render the profile page of the user.
router.get("/user-profile", (req, res) => {
  res.render("users/user-profile", { user: req.session.user });
});

// 5. GET route ==> to render the login form to user
router.get("/login", (req, res) => res.render("auth/login"));

// 6. POST route ==> to process form data (don't forget to compare with bcrypt ;{ )
router.post("/login", (req, res, next) => {
  console.log("SESSION =====> ", req.session);
  // get the data from login form
  const { username, password } = req.body;

  // Validate that incoming data is not empty.
  if (!username || !password) {
    res.render("auth/login", {
      username,
      errorMessage:
        "All fields are mandatory. Please provide your email and password.",
    });
    return;
  }

  // find user and send correct response
  User.findOne({ username })
    .then((user) => {
      console.log(user);
      // check if found user was an object or null
      if (!user) {
        res.render("auth/login", {
          username,
          errorMessage: "Username is not registered. Try with other username.",
        });
        return;
      } else if (bcrypt.compareSync(password, user.password)) {
        //res.render("users/user-profile", { user });

        // Adding user to session so we can have an eye.
        // redirect to the route for the profile
        req.session.user = user;
        res.redirect("/user-profile");
      } else {
        res.render("auth/login", {
          username,
          errorMessage: "Incorrect password",
        });
      }
    })
    .catch((error) => next(error));
});

// 7. POST
router.post("/logout", (req, res) => {
  // Alternative 1 for logging out
  req.session.destroy();
  res.redirect("/");
});

router.get("/main", checkUserStatus, (req, res) => {
  res.render("users/main");
});

router.get("/private", checkUserStatus, (req, res) => {
  res.render("users/private");
});

function checkUserStatus(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

module.exports = router;
