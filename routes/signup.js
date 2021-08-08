const router = require("express").Router();
const User = require("../../models/User.model");
const bcryptjs = require("bcryptjs");
const saltRounds = 10;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(req.body.password, salt))
    .then((hash1) => {
      return User.create({
        username: req.body.username,
        hashedPassword: hash1,
      });
    })
    .then((user) => {
      console.log("User created: ", user);
      res.redirect("/");
    })
    .catch((err) => console.log("An Error occured: ", err));
});

module.exports = router;
