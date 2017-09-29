const express        = require("express");
const router         = express.Router();
const User           = require('../models/user');
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/signup", (req, res) => {
  // console.log("it works");
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashedPW = bcrypt.hashSync(password, salt);

  const newUser = new User({
    username: req.body.username,
    password: hashedPW
  });
  newUser.save().then(user => {
    res.render("index");
  });
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if fields are fullfilled
    if (username === "" || password === "") {
      res.render("login", {
        errorMessage: "Indicate a username and a password to sign up"
      });
      return;
    }

    User.findOne({ "username": username }, (err, user) => {
    // Check if the user exist in the db
         if (err || !user) {
           res.render("login", {
             errorMessage: "The username doesn't exist"
           });
           return;
         }

         if (bcrypt.compareSync(password, user.password)) {
           // Save the login in the session
           req.session.currentUser = user;
           res.redirect("/");
         } else {
           res.render("login", {
             errorMessage: "Incorrect password"
           });
         }
     });
});



module.exports = router;
