const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const bcryptSalt = 10;

const User = require('../model/user');

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
        return res.render("signup", {
            errorMessage: "Indicate a username and a password to sign up"
        });
    }

    User.findOne({"username": username}, (err, user) => {
      if (!user){
        var salt     = bcrypt.genSaltSync(bcryptSalt);
        var hashPass = bcrypt.hashSync(password, salt);
        console.log(hashPass);

        var newUser  = new User({
            username: username,
            password: hashPass
        });

        newUser.save((err) => {
            res.redirect("/");
        });
      } else {
        return res.render("signup", {
            errorMessage: "This user already exist, inutil!"
        });
      }
    });
});

router.post("/login", (req, res) => {

  var username = req.body.username;
  var password = req.body.password;
    if (username === "" || password === "") {
        return res.render("login", {
            errorMessage: "Indicate a username and a password to sign up"
        });
    }
    User.findOne({ "username": username }, (err, user) => {
        if (err || !user) {
            return res.render("login", {
                errorMessage: "The username doesn't exist"
            });
        }
        if (bcrypt.compareSync(password, user.password)) {
            // Save the login in the session!
            req.session.currentUser = user;
            res.redirect("/");
        } else {
            res.render("login", {
            errorMessage: "Incorrect password"
            });
        }
    });
})
module.exports = router;
