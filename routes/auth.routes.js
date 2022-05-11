const router = require("express").Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

const saltRounds = 10;

/* router.get("/profile", (req, res, next) => {
  res.render(
    "user/profile",
    //keeps the user logged in (cookies)
    { user: req.session.currentUser }
  );
}); */

/* SIGN UP ROUTES */

router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", isLoggedOut, (req, res, next) => {
  const { username, email, password } = req.body;
  //Confirm that user inserted all of the requirements for sign up
  if (!username || !email || !password) {
    res.render("auth/signup", {
      errorMessage: "Please fill in all the fields!",
    });
  }
  //Confirm that the password is strong enough
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!regex.test(password)) {
    return res.status(400).render("auth/signup", {
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }

  //CRYPT THE PASSWORD!
  //1st add salt
  bcrypt
    .genSalt(saltRounds)
    .then((salt) => {
      return bcrypt.hash(password, salt);
    })
    //Create the user! now it's salty. Make sure to connect passwordHash(from the model) with the hashedPassword
    .then((hashedPassword) => {
      return User.create({
        username,
        email,
        passwordHash: hashedPassword,
      });
    })
    //Sign success = redirect to their profile
    .then((user) => {
      req.session.currentUser = user;
      req.app.locals.currentUser = user;
      console.log(user);
      res.render("user/profile", { user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: err.message });
      } else if (err.code === 1100) {
        //If there's already a username or email in the database, the error is of code 11000
        res.status(500).render("auth/signup", {
          errorMessage: "Username or email already in use.",
        });
      } else {
        next(err);
      }
    });
});

/* SIGN IN ROUTES */

router.get("/login", isLoggedOut, (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", isLoggedOut, (req, res, next) => {
  //Provide information
  const { email, password } = req.body;

  //If person doesn't insert the required fields
  if (!email || !password) {
    res.render("auth/login", {
      errorMessage: "Please insert your email and password.",
    });
  }

  //Compare the email and password provided with the ones in the database

  //First look for the user in the database
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        //if you can't find a user with that email, display error message and don't let them move on
        res.render("auth/login", {
          errorMessage: "No user matches the inserted email.",
        });
        return;
      } else if (bcrypt.compareSync(password, user.passwordHash)) {
        //if the email exists, check if the password is correct
        req.session.currentUser = user;
        req.app.locals.currentUser = user;

        res.render("user/profile", { user });
      } else {
        //if it's incorrect, let the user know
        res.render("auth/login", { errorMessage: "Incorrect password" });
      }
    })
    //if it's another error, throw the error!
    .catch((err) => next(err));
});

/* LOG OUT */

router.get("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
