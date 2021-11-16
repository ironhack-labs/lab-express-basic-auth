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
    console.log(salt.length);
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

  console.log(username);
  User.findOne({ username: username }).then((userFromDb) => {
    console.log(userFromDb);
    if (userFromDb === null) {
      res.render("auth/login", { message: "Wrong username or password" });
      return;
    }
    const result = bcrypt.compareSync(password, userFromDb.password);
    res.send({ result });
  });
});
module.exports = router;
