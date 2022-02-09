const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const saltRounds = 10;
const {
  isLoggedIn,
  isLoggedOut,
  checkFields,
} = require("../middleware/route-guard");

router.get("/signup", isLoggedOut, (req, res) => {
  res.render("signup");
});

router.post("/signup", isLoggedOut, checkFields, (req, res) => {
  const hashedPass = bcrypt.hashSync(
    req.body.password,
    bcrypt.genSaltSync(saltRounds)
  );
  User.create({
    username: req.body.username,
    password: hashedPass,
  }).then((results) => {
    req.session.user = results;
    res.render("index");
  });
});

router.get("/login", isLoggedOut, (req, res) => {
  res.render("login");
});

router.post("/login", isLoggedOut, checkFields, (req, res) => {
  User.findOne({ username: req.body.username })
    .then((results) => {
      if (!results) {
        return res.render("login", {
          message: "username or password was incorrect, please try again",
        });
      }

      if (!bcrypt.compareSync(req.body.password, results.password)) {
        return res.render("login", {
          message: "username or password was incorrect, please try again",
        });
      }
      req.session.user = results;
      res.redirect("test-loggedin");
    })
    .catch((err) => {
      console.log("something went wrong when posting login: ", err);
      res.json(err);
    });
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy();
  res.redirect("login");
});

router.get("/test-loggedin", isLoggedIn, (req, res) => {
  res.render("private/welcome", { message: req.session.user.username });
});

module.exports = router;
