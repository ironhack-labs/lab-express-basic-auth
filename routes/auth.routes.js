const router = require("express").Router();
const bcryptjs = require("bcryptjs");

const User = require("./../models/User.model");
const saltRounds = 10;

//Signup render
router.get("/signup", (req, res, next) => res.render("auth/signup-page"));

//Signup handle
router.post("/signup", (req, res, next) => {
  const { username, email, userPwd } = req.body;

  if (username.length < 5) {
    res.render("auth/signup-page", {
      errorMessage: "Username must be a minimum of 5 characters",
    });
    return;
  } else if (userPwd.length === 0 || email.length === 0) {
    res.render("auth/signup-page", {
      errorMessage: "Please fill in all fields",
    });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(userPwd, salt))
    .then((hashedPassword) => {
      console.log("El hash a crear en la BBDD es", hashedPassword);
      return User.create({ username, email, passwordHash: hashedPassword });
    })
    .then((createdUser) => res.redirect("/login"))
    .catch((error) => next(error));
});

//Login render
router.get("/login", (req, res, next) => res.render("auth/login-page"));

//Login handle
router.post("/login", (req, res, next) => {
  const { email, userPwd } = req.body;

  if (email.length === 0 || userPwd.length === 0) {
    res.render("auth/login-page", {
      errorMessage: "Please fill in all fields",
    });
    return;
  }
  User.findOne({ email }).then((user) => {
    if (!user) {
      res.render("auth/login-page", {
        errorMessage: "Email not registered in the Database",
      });
      return;
    } else if (bcryptjs.compareSync(userPwd, user.passwordHash) === false) {
      res.render("auth/login-page", {
        errorMessage: "Password is incorrect",
      });
      return;
    } else {
      req.session.currentUser = user;
      console.log("El objeto de EXPRESS-SESSION", req.session);
      res.redirect("/profile");
    }
  });
});

//Logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

module.exports = router;
