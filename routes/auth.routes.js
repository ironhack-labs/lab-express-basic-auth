const { Router } = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const router = new Router();
const User = require("../models/User.model");

const saltRounds = 10;

router.get("/signup", (req, res) => res.render("auth/signup"));

router.get("/userProfile", (req, res) => {
  res.render("users/user-profile", {
    userInSession: req.session.currentUser,
  });
});

router.get("/login", (req, res) => res.render("auth/login"));

router.post("/signup", (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.render("auth/signup", {
      errorMessage: "Email, username, and password are mandatory.",
    });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render("auth/signup", {
      errorMessage:
        "The password must contain at least 6 characters, and include one number, one lowercase and one uppercase letter.",
    });

    return;
  }

  bcrypt
    .genSalt(saltRounds)
    .then(salt => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      // Create the user in the db
      return User.create({
        username: username,
        email: email,
        passwordHash: hashedPassword,
      }); // We can access this outside because we return the promise
    })
    // We catch the promise outside
    .then(user => {
      console.log(`User created: ${user}`);
      req.session.currentUser = user;
      res.redirect("/userProfile");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).render("auth/signup", {
          errorMessage: error.message,
        });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage: "Username or email already exist.",
        });
      } else {
        next(error);
      }
    });
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Email and password are mandatory.",
    });
    return;
  }

  User.findOne({ email })
    .then(user => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "This email is not registered. Enter another email.",
        });
        return;
      } else if (bcrypt.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect("/userProfile");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch(e => next(e));
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });  

module.exports = router;
