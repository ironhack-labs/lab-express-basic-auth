const express = require("express");
const router = express.Router();

const zxcvbn = require("zxcvbn");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const User = require("./../models/User.model");

/* GET home page */
router.get("/", (req, res, next) => res.render("index"));

router.get("/signup", (req, res, next) => res.render("signup"));

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  //CHECK IF USER & PASS ARE EMPTY
  if (username === "" || password === "") {
    res.render("signup", {
      errorMessage: "Please enter username and password",
    });
    return;
  }

  //CHECK PASSWORD SAFETY
  //   const passwordCheck = zxcvbn(password);
  //   if (passwordCheck.score < 3) {
  //     console.log("passwordCheck.feedback", passwordCheck.feedback);

  //     res.render("signup", {
  //       errorMessage: passwordCheck.feedback.warning,
  //       suggestions: passwordCheck.feedback.suggestions,
  //     });
  //     return;
  //   }

  //CHECK IF NAME IS TAKEN
  User.findOne({ username }).then((user) => {
    // > if username is taken, display error message
    if (user !== null) {
      res.render("signup", { errorMessage: "There was an error, try again" });
      return;
    }

    //HASH PASSWORD
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    //CREATE USER
    User.create({ username, password: hashedPassword })
      .then((createdUser) => {
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
        res.render("signup", {
          errorMessage: "There was an error, please try again!",
        });
      });
  });
});

router.get("/login", (req, res, next) => res.render("login"));

router.post("/login", (req, res, next) => {
  const { password, username } = req.body;

  if (username === "" || password === "") {
    res.render("login", { errorMessage: "Please enter username and password" });

    return;
  }

  User.findOne({ username }).then((user) => {
    if (!user) {
      res.render("login", { errorMessage: "Indicate username and password" });

      return;
    }

    const passwordCorrect = bcrypt.compareSync(password, user.password);

    if (passwordCorrect) {
      console.log("you are logged in");
      req.session.currentUser = user;
      res.redirect("/");
    } else {
      res.render("login", {
        errorMessage: "No has pogut fer login, password incorrecte",
      });
    }
  });
});

module.exports = router;
