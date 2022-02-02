const { Router } = require("express");
const router = new Router();
let bcryptjs = require("bcryptjs");
var saltRounds = 10;

const User = require("../models/User.model");

// POST login route ==> to process form data
router.post("/login", (req, res, next) => {
  console.log("SESSION =====> ", req.session);
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }

  User.findOne({ email }) // <== check if there's user with the provided email
    .then((user) => {
      // <== "user" here is just a placeholder and represents the response from the DB
      if (!user) {
        // <== if there's no user with provided email, notify the user who is trying to login
        res.render("auth/login", {
          errorMessage: "Email is not registered. Try with other email.",
        });
        return;
      }
      // if there's a user, compare provided password
      // with the hashed password saved in the database
      else if (bcryptjs.compareSync(password, user.passwordHash)) {
        // if the two passwords match, render the user-profile.hbs and
        //                   pass the user object to this view
        //                                 |
        //                                 V
        // res.render("users/user-profile", { user });

        // when we introduce session, the following line gets replaced with what follows:
        // res.render('users/user-profile', { user });

        //******* SAVE THE USER IN THE SESSION ********//
        req.session.currentUser = user;
        res.redirect("/user/user-profile");
      } else {
        // if the two passwords DON'T match, render the login form again
        // and send the error message to the user
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});
module.exports = router;
