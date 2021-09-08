const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
    const { username, password } = req.body;
    // check if we have a user with that username in the database
    User.findOne({ username: username })
    .then(userFromDB => {
        if (userFromDB === null) {
            // if not -> the username is not correct
            // -> show signup page again
            res.render("login", { message: 'incorrect credentials' })
        }
        // figure out how to compare users
        // username is correct
        // we check the password from the input against the hash in the database
        // compareSync() returns true or false
        if (bcrypt.compareSync(password, userFromDB.password)) {
            req.session.user = userFromDB;
            res.redirect("/main");
        } else {
            // if the password is not matching -> show the form again
            res.render("login", { message: 'incorrect password' })
        }
    })
})

router.post("/signup", (req, res, next) => {
  console.log(req.body); // check the info
  const { username, password } = req.body;
  // is the username empty
  if (username.length === 0) {
    res.render("signup", { message: "Username cannot be empty" });
    return;
  }
  // we not check if the username already exists
  User.findOne({ username: username }).then((userFromDB) => {
    // if user exists
    if (userFromDB !== null) {
      res.render("signup", { message: "Username is already taken" });
    } else {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);
      console.log(hash);
      // we create a document for that user in the db with the hashed
      User.create({ username: username, password: hash })
        .then((createdUser) => {
          console.log(createdUser);
          res.redirect("/");
        })
        .catch((err) => {
          next(err);
        });
    }
  });
});

router.get("/logout", (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            next(err);
        } else {
            res.redirect("/");
        }
    })
});

module.exports = router;
