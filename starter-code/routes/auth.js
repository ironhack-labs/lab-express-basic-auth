const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const userModel = require("../models/User");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

/* GO TO THE SIGNUP FORM */
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.get("/private", (req, res, next) => {
  res.render("private");
})

/* GO TO THE LOGIN FORM */
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

// ACTION : REGISTER
router.post("/signup", (req, res, next) => {
  // req.body contains the submited informations
  const user = req.body;

  if (!user.username || !user.password) {
    console.error("error: ", "fill the form entirely please");
    res.redirect("/auth/signup");
    return;
  } else {
    userModel
      // try to find a user with the same username (unique)
      .findOne({ username: user.username })
      .then(dbRes => {
        if (dbRes) {
          console.error("error: ", "sorry, this username is already taken!");
          return res.redirect("/auth/signup");
        }

        const salt = bcrypt.genSaltSync(10); // https://en.wikipedia.org/wiki/Salt_(cryptography)
        const hashed = bcrypt.hashSync(user.password, salt); // generated a secured random hashed password
        user.password = hashed; // new password is ready for db

        userModel.create(user).then(() => res.redirect("/auth/login"));
        console.log("Success: User has been created!");
      })
      .catch(next);
  }
});

router.post("/login", (req, res, next) => {
  // OR /auth/login ???
  const user = req.body;
  console.log(user);
  console.log(user.username);
  console.log(user.password);

  if (!user.username || !user.password) {
    console.error("Wrong credentials.");
    return res.redirect("/auth/login");
  }

  userModel
    .findOne({ username: user.username })
    .then(dbRes => {
      if (!dbRes) {
        // case 1: no user found with this username
        console.error("Wrong credentials.......");
        return res.redirect("/auth/login");
      }
      // case 2: user has been found in DB !
      if (bcrypt.compareSync(user.password, dbRes.password)) {
        // encryption says : password match success
        const { _doc: clone } = { ...dbRes }; // make a clone of db user
        delete clone.password; // remove password from clone
        console.log(clone);
        req.session.currentUser = clone; // user is now in session... until session.destroy
        // req.session.totoFriends = clone; // req.session.*** could be toto
        console.log("Welcome! You've been logged successfully");
        return res.redirect("/private");
      } else {
        // encrypted password match failed
        console.error("error", "wrong credentials!!!");
        return res.redirect("/auth/login");
      }
    })
    .catch(next);
});


module.exports = router;