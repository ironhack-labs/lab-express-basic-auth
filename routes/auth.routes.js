const router = require("express").Router();
const UserModel = require("../models/User.model.js");
const bcrypt = require("bcryptjs");

router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  console.log(username);
  // Check for unique username
  // if (!username.unique) {
  //   console.log("I run");
  //   res.render("auth/signup.hbs", { message: "The username is already taken" });
  //   return;
  // }

  // Check if username and password fields are empty
  if (!username || !password) {
    res.render("auth/signup.hbs", { message: "Please fill the fields" });
    return;
  }

  //   Encrypt password
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  UserModel.create({ username, password: hash })
    .then(() => {
      res.redirect("/signin");
    })
    .catch((err) => {
      res.render("auth/signup.hbs", {
        message: "The username is already taken",
      });
    });
});

router.get("/signin", (req, res, next) => {
  res.render("auth/signin");
});

router.post("/signin", (req, res, next) => {
  const { username, password } = req.body;
  UserModel.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth/signin.hbs", {
          message: "Username and password are not correct",
        });
      } else {
        let passwordIsValid = bcrypt.compareSync(password, user.password);
        if (passwordIsValid) {
          req.session.loggedInUser = user;
          req.session.userIsLoggedIn = true;
          req.app.locals.isUserLoggedIn = req.session.userIsLoggedIn;
          res.redirect("/private");
        }
      }
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/private", checkIfUserIsLoggedIn, (req, res, next) => {
  res.render("auth/private.hbs");
});

router.get("/main", checkIfUserIsLoggedIn, (req, res, next) => {
  res.render("auth/main.hbs");
});

function checkIfUserIsLoggedIn(req, res, next) {
  if (req.session.userIsLoggedIn) {
    next();
  } else {
    res.redirect("/signin");
  }
}

router.get("/logout", (req, res, next) => {
  req.session.userIsLoggedIn = false;
  req.app.locals.isUserLoggedIn = req.session.userIsLoggedIn;
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
