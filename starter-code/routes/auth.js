const express = require("express");
const authenticationRouter = express.Router();
const User = require("./../models/User");
const bcrypt = require("bcrypt");
const zxcvbn = require("zxcvbn");
const saltRounds = 10;

authenticationRouter.post("/", (req, res) => {
  const { username, password } = req.body; // <- deconstruction

  if (password === "" || username === "") {
    res.render("auth/signup-form", {
      errorMessage: "Please make sure you entered a Username and a Password"
    });
    return;
    // if (zxcvbn(password).score < 3) {
    //   res.render("auth/signup-form", {
    //     errorMessage: "Password is weak . Try adding different characters type or making it longer"
    //   });
    //   return;
    // } move out of here . next line
  }

  //We check if the username is taken already
  User.findOne({ username })
    .then(user => {
      if (user) {
        // if the {{username}} is in the Database show an error
        res.render("auth/signup", { errorMessage: "Username is already in use." });
        return;
      }
      // if username is available create salt and hashedPW
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPW = bcrypt.hashSync(password, salt); // PW hasing

      User.create({ username, password: hashedPW }) // User creation in DB
        .then(createUser => res.redirect("/")) // Redirect to home page
        .catch(err =>
          res.render("auth/signup-form", { errorMessage: "Error while creating new User" })
        );
    })
    .catch(err => console.log(err));
});

authenticationRouter.get("/", (req, res) => {
  res.render("auth/signup-form");
});

module.exports = authenticationRouter;
