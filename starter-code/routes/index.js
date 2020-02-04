const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const protectRoute = require("../middlewares/protectRoute");

/* GET home page */
router.get(["/", "/index"], (req, res, next) => {
  res.render("index");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res, next) => {
  res.render("register");
});

router.post("/register", (req, res, next) => {
  const user = req.body;
  console.log(user);
  if (!user.username || !user.password) {
    console.log("username et password  ");
    res.flash("error", "please check your fields empty is not accepted");
    res.redirect("/register");
    return;
  } else {
    userModel
      .findOne({ username: user.username })
      .then(dbRes => {
        if (dbRes) return res.redirect("/register"); //

        const salt = bcrypt.genSaltSync(10); // https://en.wikipedia.org/wiki/Salt_(cryptography)
        const hashed = bcrypt.hashSync(user.password, salt); // generates a secured random hashed password
        user.password = hashed; // new user is ready for db

        userModel.create(user).then(() => res.redirect("/login"));
      })
      .catch(next);
  }
});

router.post("/login", (req, res, next) => {
  const user = req.body;

  if (!user.username || !user.password) {
    // one or more field is missing
    req.flash("error", "wrong credentials");
    return res.redirect("/login");
  }

  userModel
    .findOne({ username: user.username })
    .then(dbRes => {
      if (!dbRes) {
        // no user found with this username
        req.flash("error", "wrong credentials");
        return res.redirect("/login");
      }
      // user has been found in DB !
      if (bcrypt.compareSync(user.password, dbRes.password)) {
        // encryption says : password match success
        const { _doc: clone } = { ...dbRes }; // make a clone of db user

        delete clone.password; // remove password from clone
        // console.log(clone);

        req.session.currentUser = clone;
        // user is now in session... until session.destroy
        return res.redirect("/index");
      } else {
        // encrypted password match failed
        return res.redirect("/login");
      }
    })
    .catch(next);
});

router.get("/main", protectRoute, (req, res) => {
  res.render("main");
});
router.get("/private", protectRoute, (req, res) => {
  res.render("private");
});

router.get("/signout", (req, res) => {
  req.session.destroy(() => {
    res.locals.isLoggedIn = undefined;
    res.redirect("/login");
  });
});

module.exports = router;
