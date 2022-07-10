const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const { isLoggedIn, isLoggedOut } = require("../middleware/middleware");

///////////////////////////////////////////////////////////////////////
/////////////////////////// SIGN UP ///////////////////////////////////
///////////////////////////////////////////////////////////////////////
router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;
  if (password.length < 4) {
    res.render("auth/signup", {
      message: "Your password has to be 4 chars min",
    });
    return;
  }
  if (username.length === 0) {
    res.render("auth/signup", { message: "Your username cannot be empty" });
    return;
  }
  // validation passed
  User.findOne({ username: username }).then((userFromDB) => {
    // if there is a user
    console.log(userFromDB);
    if (userFromDB !== null) {
      res.render("auth/signup", { message: "Your username is already taken" });
      return;
    } else {
      // we hash the password
      const salt = bcrypt.genSaltSync(10);
      console.log(salt);
      const hash = bcrypt.hashSync(password, salt);
      // create the user
      User.create({
        username: username,
        password: hash,
      })
        .then((createdUser) => {
          // console.log(createdUser);
          res.redirect("/userProfile");
        })
        .catch((err) => {
          next(err);
        });
    }
  });
});

///////////////////////////////////////////////////////////////////////
/////////////////////////// LOGIN /////////////////////////////////////
///////////////////////////////////////////////////////////////////////

router.get("/login", isLoggedOut, (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;
  console.log("SESSION =====> ", req.session);
  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to login.",
    });
    return;
  }
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "Username is not registered. Try with other username.",
        });
        return;
      } else if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user; // SESSION
        res.redirect("/userProfile");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});

///////////////////////////////////////////////////////////////////////
//////////////////////// User Profile /////////////////////////////////
///////////////////////////////////////////////////////////////////////
router.get("/userProfile", isLoggedIn, (req, res) => {
  res.render("auth/user-profile", { userInSession: req.session.currentUser });
});

///////////////////////////////////////////////////////////////////////
//////////////////////// Log Out //////////////////////////////////////
///////////////////////////////////////////////////////////////////////

router.post("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    console.log("workin!!!!!!!!!!!!!!!");
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
