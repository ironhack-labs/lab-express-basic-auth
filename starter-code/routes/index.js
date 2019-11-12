const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const userModel = require("../Models/User");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/main", (req, res, next) => {
  res.render("main");
});

router.get("/private", (req, res, next) => {
  res.render("private");
});

/////// SIGN UP

router.post("/", (req, res, next) => {
  const user = req.body; // req.body contains the submited informations (out of post request)

  if (!user.username || !user.password) {
    res.render("index", {
      errorMessage: "Please enter both, username and password to signup"
    });
    console.log("signup: Please enter both, username and password to signup");
    return;
  } else {
    userModel
      .findOne({
        username: user.username
      })
      .then(dbRes => {
        if (dbRes) {
          // si les usernames et passwords sont déjà dans la db ...
          res.render("index", {
            // ... alors tu restes sur la home page
            errorMessage: "The user already exists, please sign in"
          });
          console.log("sign up: username already exists");
          return;
        }
        const salt = bcrypt.genSaltSync(10); // cryptography librairie
        const hashed = bcrypt.hashSync(user.password, salt);
        console.log("user created successfully !");
        user.password = hashed;

        userModel
          .create(user)
          .then(() => res.redirect("/")) // which page ???
          .catch(dbErr => console.log("user not created", dbErr));
      })
      .catch(dbErr => {
        next(dbErr);
        console.log("don't find the username/password");
      });
  }
});

/////// LOGIN (once you have created an account)

router.get("/signin", (req, res, next) => {
  res.render("signin");
});

router.post("/signin", (req, res, next) => {
  const user = req.body;

  if (!user.username || !user.password) {
    return res.redirect("/signin");
  }

  userModel
    .findOne({
      username: user.username
    })
    .then(dbRes => {
      if (!dbRes) {
        // if user doesn't exist in the db
        res.render("/", { errorMessage: "The username doesn't exist" });
        return;
      }

      // user has been found in DB !

      if (bcrypt.compareSync(user.password, dbRes.password)) {
        // compare les data (ici = les passwords)
        console.log("good password", dbRes);
        req.session.currentUser = dbRes; // stocke le result dbRes dans le currentUser de la session
        return res.redirect("/main");
      } else {
        console.log("bad password");
        res.redirect("/signin");
        return;
      }
    })
    .catch(dbErr => {
      next(dbErr);
    });
});

module.exports = router;
