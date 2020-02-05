const express = require('express');
const router  = express.Router();
const userModel = require("../models/User");
const bcrypt = require("bcrypt");
const flash = require("connect-flash");

const mainAuth = require("../middlewares/protectPrivateRoute")
const privateAuth = require("../middlewares/protectPrivateRoute")


/* GET home page */

// SIGN UP

router.get('/', (req, res, next) => {
  res.render('index');
});


router.post("/", (req, res, next) => {
  const user = req.body;
  console.log(user)
  if (!user.username || !user.password) {
    req.flash("error", "no empty fields here please");
    res.redirect("/");
    return;
  } else {
    userModel
      .findOne({ username: user.username })
      .then(dbRes => {
        if (dbRes) {
          req.flash("error", "sorry, username is already taken :/");
          return res.redirect("/"); //
        }
        const salt = bcrypt.genSaltSync(10); // https://en.wikipedia.org/wiki/Salt_(cryptography)
        const hashed = bcrypt.hashSync(user.password, salt); // generates a secured random hashed password
        user.password = hashed; // new user is ready for db
    
        userModel.create(user).then(() => res.redirect("/signin"));
        // .catch(dbErr => console.log(dbErr));
      })
      .catch(next);
  }
});

// LOG IN

router.get('/signin', (req, res, next) => {
  res.render('login');
});


router.post("/signin", (req, res, next) => {
  const user = req.body;

  if (!user.username || !user.password) {
    // one or more field is missing
    req.flash("error", "empty fields");
    console.log("empty strings");
    return res.redirect("/signin");
  }

  userModel
    .findOne({ username: user.username })
    .then(dbRes => {
      if (!dbRes) {
        // no user found with this email
        req.flash("error", "wrong credentials");
        console.log("no user found");
        return res.redirect("/signin");
      }
      // user has been found in DB !
      if (bcrypt.compareSync(user.password, dbRes.password)) {
        // encryption says : password match success
        const { _doc: clone } = { ...dbRes }; // make a clone of db user

        delete clone.password; // remove password from clone
        // console.log(clone);

        req.session.currentUser = clone; // user is now in session... until session.destroy
        return res.redirect("/signin");
      } else {
        // encrypted password match failed
        req.flash("error", "wrong credentials");
        return res.redirect("/login");
      }
    })
    .catch(next);
});



module.exports = router;
