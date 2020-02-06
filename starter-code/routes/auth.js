const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.get("/signup", (req, res) => {
  res.render("auth/signup", { js: ["signup"] });
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

// SIGN UP

router.post("/signup", (req, res, next) => {
  const user = req.body;
  if (!user.username || !user.password) {
    return res.render("auth/signup", {error : "Indicate username and password to sign up"})
  } else {
    User
    .findOne({ username: user.username })
    .then(dbRes => {
      if (dbRes) {
        return res.render("auth/signup", {error : "The username already exists"});
      };
      const salt = bcrypt.genSaltSync(10);
      const hashed = bcrypt.hashSync(user.password, salt);
      user.password = hashed;

      User
      .create(user)
      .then(() => res.redirect("/auth/login"))
    })
    .catch(next);
  }
});

// LOG IN

router.post("/login", (req,res,next) => {
    const user = req.body;
  
    if (!user.username || !user.password) {
        return res.render("auth/login", {
          error : "Indicate username and password to sign in"
        })
    }

    User
    .findOne({ username: user.username })
    .then(dbRes => {
        if (!dbRes) {
            return res.render("auth/login", {
              error : "Incorrect username or password"
            })
        }
        console.log("here")
        if (bcrypt.compareSync(user.password, dbRes.password)) {
            // const { _doc: clone } = { ...dbRes };
            // delete clone.password;
            // req.session.currentUser = clone;

            req.session.currentUser = user;
            return res.redirect("/main");
        }
        else {
            return res.render("auth/login", {
              error : "Incorrect username or password"
            });
        }
    })
    .catch(next);
})

// LOG OUT

router.get("/signout", (req, res) => {
  req.session.destroy(() => {
    res.locals.isLoggedIn = undefined;
    res.redirect("/");
  });
});

module.exports = router;