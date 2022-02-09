const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const saltRounds = 10;
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

let checkFields = (fields) => {
  let errors = [];
  if (!fields.username) {
    errors.push("You did not include a name!");
  }
  if (!fields.password) {
    errors.push("You need a password");
  }
  if (errors.length > 0) {
    return errors;
  }
  return false;
};
router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", (req, res) => {
  let problem = checkFields(req.body);
  if (problem) {
    return res.render("signup", { message: problem });
  }

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

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  let errors = [];
  if (!req.body.username) {
    errors.push("You did not include a name!");
  }
  if (!req.body.password) {
    errors.push("You need a password");
  }
  if (errors.length > 0) {
    res.json(errors);
  }

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

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("login");
});

router.get("/test-loggedin", isLoggedIn, (req, res) => {
  res.render("private/welcome", { message: req.session.user.username });
});

module.exports = router;
