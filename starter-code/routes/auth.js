const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.get("/signup", (req, res) => {
  res.render("auth/signup", { js: ["signup"] });
});

router.get("/signin", (req, res) => {
  res.render("auth/signin");
});

// SIGN UP

router.post("/signup", (req, res, next) => {
  const user = req.body;
  if (!user.username || !user.password) {
    return res.render("auth/signip", {error : "Enter credentials"})
  } else {
    User
    .findOne({ username: user.username })
    .then(dbRes => {
      if (dbRes) {
        return res.render("auth/signup", {error : "User already exists"})
      };
      const salt = bcrypt.genSaltSync(10);
      const hashed = bcrypt.hashSync(user.password, salt);
      user.password = hashed;

      User
      .create(user)
      .then(() => res.redirect("/auth/signin"))
    })
    .catch(next);
  }
});

// LOG IN

router.post("/signin", (req,res,next) => {
    const user = req.body;
  
    if (!user.username || !user.password) {
        return res.render("auth/signin", {error : "Enter credentials"})
    }

    User
    .findOne({ username: user.username })
    .then(dbRes => {
        if (!dbRes) {
            return res.render("auth/signin", {error : "No user found"})
        }
        console.log("here")
        if (bcrypt.compareSync(user.password, dbRes.password)) {
            const { _doc: clone } = { ...dbRes };

            delete clone.password;

            req.session.currentUser = clone;
            return res.redirect("/dashboard");
        }
        else {
            return res.redirect("/auth/signin");
        }
    })
    .catch(next);
})

// LOG OUT

router.get("/signout", (req,res) => {
    req.session.destroy(() => {
        res.locals.isLoggedIn = undefined;
        res.locals.isAdmin = undefined;
        res.redirect("/auth/signin");
    });
});

module.exports = router;