const { Router } = require("express");
const router = new Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const User = require("../models/User.model");

router.get("/signup", (req, res, next) => res.render("auth/signup"));

router.post("/signup", (req, res, next) => {
  //   console.log("The form data: ", req.body);
  const { username, password } = req.body;

  const salt = bcryptjs.genSaltSync(saltRounds);
  const hashedPassword = bcryptjs.hashSync(password, salt);
  console.log(`Password hash: ${hashedPassword}`);

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDB) => {
      console.log("Newly creaed user is: ", userFromDB);
      res.redirect("/userProfile");
    })
    .catch((err) => next(err));
});

router.get("/userProfile", (req, res, next) =>
  res.render("users/user-profile")
);

module.exports = router;
