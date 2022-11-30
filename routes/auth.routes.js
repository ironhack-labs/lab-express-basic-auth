const router = require("express").Router();
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const saltRounds = 10;

router.get("/signup", (req, res, next) => {
    res.render("signup");
});

router.post("/signup", (req, res, next) => {
    const { username, email, password } = req.body;
    bcryptjs
      .genSalt(saltRounds)
      .then((salt) => bcryptjs.hash(password, salt))
      .then((hashedPassword) => {
        return User.create({username, email, passwordHash: hashedPassword})
      })
      .then((userDb) => res.redirect('/'))
      .catch((error) => next(error));
});

module.exports = router;