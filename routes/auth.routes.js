const { Router } = require("express");
const router = new Router();

const mongoose = require("mongoose");

const User = require("../models/User.model");

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

// GET route ==> to display the signup form to users
router.get("/signup", (req, res) => res.render("signup"));

// POST route ==> to process form data
router.post("/signup", (req, res, next) => {
  // console.log("The form data: ", req.body);

  const { username, password } = req.body;

  // make sure users fill all mandatory fields:
  if (!username || !password) {
    res.render("signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,

        //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDB) => {
      console.log("Newly created user is: ", userFromDB);
    })
    .catch((error) => next(error));
});





router.get("/login", (req, res) => res.render("login"));

router.post("/login", (req, res, next) => {

    console.log("SESSION =====> ", req.session);

  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("login", {
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      console.log(password, user.passwordHash);

      if (!user) {
        res.render("login", {
          errorMessage: "Email is not registered. Try with other email.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect("/user");
      } else {
        res.render("login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));

});

router.get("/user", (req, res) => {
  res.render("user", { userInSession: req.session.currentUser });
});


module.exports = router;
