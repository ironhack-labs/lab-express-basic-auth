const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (username.length == 0 || password.length == 0) {
    res.render("auth/signup", { message: "invalid username or password." });
    return;
  }
  User.findOne({ username: username }).then((userFromDb) => {
    if (userFromDb !== null) {
      res.render("auth/signup", { message: "Your username is already taken." });
      return;
    }
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);
    // create the user
    User.create({ username: username, password: hash })
      .then((createdUser) => {
        console.log(createdUser);
        res.redirect("/login");
      })
      .catch((err) => next(err));
  });
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username: username }).then((userFromDb) => {
    if (userFromDb === null) {
      res.render("auth/login", { message: "Wrong username or password" });
      return;
    }
    // username is correct
    // check the password against the hash in the database
    // compareSync() -> true or false
    if (bcrypt.compareSync(password, userFromDb.password)) {
      // it matches -> credentials are correct -> user get's logged in
      // req.session.<some key (usually 'user')>
      req.session.user = userFromDb;
      res.redirect("/profile");
    } else {
      // password is not correct -> show login again
      res.render("auth/login", { message: "Wrong username or password" });
    }
  });
});

// middleware to protect a route
const loginCheck = () => {
  return (req, res, next) => {
    // check for a logged in user
    if (req.session.user) {
      next();
    } else {
      res.redirect("/login");
    }
  };
};

router.get("/profile", loginCheck(), (req, res, next) => {
  // this is how we can set a cookie
  //res.cookie("ourCookie", "hello node");
  //console.log("this is our cookie: ", req.cookies);
  // to clear a cookie
  //res.clearCookie("ourCookie");

  // we retrieve the logged in user from the session
  const loggedInUser = req.session.user;
  res.render("auth/profile", { user: loggedInUser });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      // if we have an error -> pass to the error handler
      next(err);
    } else {
      // success
      res.redirect("/");
    }
  });
});

module.exports = router;
