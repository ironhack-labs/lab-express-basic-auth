const express = require("express");
const authRouter = express.Router();
const User = require("./../models/user-model");

const bcrypt = require("bcrypt");
const saltRounds = 12;

//const zxcvbn = require("zxcvbn");

// GET    '/auth/signup'     -  Renders the signup form
authRouter.get("/signup", (req, res) => {
  res.render("auth-views/signup-form");
});

// POST    '/auth/signup'
authRouter.post("/signup", (req, res, next) => {
  // 1. Get the username and password from req.body
  const { username, password } = req.body;

  // 2.1 Check if the username and password are provided
  if (username === "" || password === "") {
    res.render("auth-views/signup-form", {
      errorMessage: "Username and Password are required.",
    });
    return; // stops the execution of the function furhter
  }

  // 2.2 Verify the password strength
  // const passwordStrength = zxcvbn(password).score;

  // console.log("zxcvbn(password) :>> ", zxcvbn(password));
  // console.log("passwordStrenth :>> ", passwordStrength);
  // if (passwordStrength < 3) {
  //   res.render("auth-views/signup-form", {
  //     errorMessage: zxcvbn(password).feedback.warning,
  //   });
  //   return;
  // }

  // 3. Check if the username is not taken
  User.findOne({ username })
    .then((userObj) => {
      if (userObj) {
        // if user was found
        res.render("auth-views/signup-form", {
          errorMessage: `Username ${username} is already taken.`,
        });
        return;
      } else {
        // Allow the user to signup if above conditions are ok

        // 4. Generate salts and encrypt the password
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // 5. Create new user in DB, saving the encrypted password
        User.create({ username, password: hashedPassword })
          .then((user) => {
            // 6. When the user is created, redirect (we choose - home page)
            res.redirect("/");
          })
          .catch((err) => {
            res.render("auth-views/signup-form", {
              errorMessage: `Error during signup`,
            });
          });
      }
    })
    .catch((err) => next(err));

  // X.  Catch errors coming from calling to User collection
});

// GET  '/auth/login'
authRouter.get("/login", (req, res) => {
  res.render("auth-views/login-form");
});

// POST    '/auth/login'
authRouter.post("/login", (req, res, next) => {
  const { password, username } = req.body;

  // 1. Check if the username and password are provided
  if (username === "" || password === "") {
    res.render("auth-views/login-form", {
      errorMessage: "Username and Password are required.",
    });
    return; // stops the execution of the function further
  }

  // 2. Check if the user/username exist in the DB
  User.findOne({ username })
    .then((user) => {
      // 3.1 If the user is not found, show error message
      if (!user) {
        res.render("auth-views/login-form", { errorMessage: "Input invalid" });
      } else {
        // 3.2 If user exists ->  Check if the password is correct
        const encryptedPassword = user.password;
        const passwordCorrect = bcrypt.compareSync(password, encryptedPassword);

        if (passwordCorrect) {
          // 4. If password is correct, login the user by creating session
          // Pass the user data to the session middleware by setting the value on:
          // req.session.currentUser
          user.password = "****";
          req.session.currentUser = user;

          // 5. Redirect the user to some page (we choose - home page)
          res.redirect("/");
        }
      }
    })
    .catch((err) => console.log(err));
});

// GET   '/auth/logout'
authRouter.get("/logout", (req, res) => {
  // We remove/destroy the session record in the database
  req.session.destroy((err) => {
    if (err) {
      res.render("error", { message: "Something went wrong! Yikes!" });
    }
    // Redirect to the page (we choose - home page)
    res.redirect("/");
  });
});













module.exports = authRouter;