const { Router } = require("express");
const router = new Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const User = require("../models/User.model");
const mongoose = require("mongoose");

///////////////////////////SIGNUP///////////////////////////

//get route and display signup form.
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

//post route with inputs from form.
router.post("/signup", (req, res, next) => {
  //destructure input data
  const { username, password } = req.body;

  //check if both fields are completed
  if (!username || !password) {
    res.render("auth/signup", { errorMessage: "Both field are mandatory" });

    //else => stop code with empty return
    return;
  }

  //Checks that a password has a minimum of 6 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number with no spaces.
  const regex = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/;

  if (!regex.test(password)) {
    res.status(500).render("auth/signup", {
      errorMessage:
        "Password must have a minimum of 6 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number with no spaces.",
    });

    //else => stop code with empty return
    return;
  }

  //encrypt password
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDb) => {
      console.log("Newly created user is: ", userFromDb);
      req.session.currentUser = userFromDb;
      res.redirect("/userProfile");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage:
            "Username and email need to be unique. Either username or email is already used.",
        });
      } else {
        next(error);
      }
    });
});

///////////////////////////LOG-IN///////////////////////////

router.get("/login", (req, res) => res.render("auth/login"));

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to login.",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "Username is not registered. Try with other email.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        //******* SAVE THE USER IN THE SESSION ********//
        req.session.currentUser = user;
        console.log("¨REDIRECT");
        res.redirect("/userProfile");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});

///////////////////////////// LOGOUT ///////////////////////////////////

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.get("/userProfile", (req, res) => {
  console.log(req.session);
  if (!req.session.currentUser) {
    res.redirect("/signup");
  } else {
    res.render("users/user-profile", {
      userInSession: req.session.currentUser,
    });
  }
});

module.exports = router;
