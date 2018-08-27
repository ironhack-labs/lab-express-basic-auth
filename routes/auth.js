const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

// BCrypt to encrypt passwords
const bcryptSalt = 10;

//Sign-Up
router.get("/register", (req, res, next) => {
  res.render("register");
});

router.post("/register", (req, res, next) => {
  const { password, username } = req.body;

  if (password.length < 6)
    return res.render("register", {
      error: "Password needs to be at least 6 characters"
    });

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const encrypted = bcrypt.hashSync(password, salt);

  const newUser = new User({
    username,
    password: encrypted
  });

  newUser.save().then(() => {});
  res.send("You signed up, gg: " + newUser.username).catch(console.error);
});

//Sign-In
router.get("/sign-in", (req, res, next) => {
  res.render("sign-in");
});

router.post("/sign-in", (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username }).then(user => {
    if (!user)
      return res.render("sign-in", { error: "Could not find this username" });

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch)
      return res.render("sign-in", { error: "Incorrect password" });

    //clear out password
    const cleanUser = user.toObject();
    delete cleanUser.password;
    req.session.currentUser = cleanUser;
res.send("it worked");
  });
});

module.exports = router;
