const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const saltRounds = 8;

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res) => {
  console.log("The information is traveling", req.body);
  const { username, password } = req.body;

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => {
      console.log("Its salty in here", salt);
      return bcrypt.hash(password, salt);
    })
    .then((passwordHashed) => {
      console.log("The hashed password is:", passwordHashed);
      User.create({
        username: username,
        password: passwordHashed,
      });
      res.redirect("/user");
    })
    .catch((error) => {
      console.log("There is an error", error);
    });
});

router.get("/user", (req, res) => {
  console.log("redirect to the userprofile");
  res.render("user/userprofile");
});

module.exports = router;
