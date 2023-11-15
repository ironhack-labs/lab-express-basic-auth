const express = require("express");
const authRouter = express();

const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const saltRounds = 12;

authRouter.get("/signup", (req, res) => {
  res.render("auth/signup");
});

authRouter.post("/signup", async (req, res) => {
  //STEP 1: DECONSTRUCT BODY
  const { username, password } = req.body;
  if (!username || !password) {
    res.render("auth/signup", {
      error: "Please enter a username and password.",
    });
    return;
  }
  const foundUser = await User.findOne({ username });
  if (foundUser) {
    res.render("auth/signup", {
      error: "User already exists!",
    });
    return;
  }

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPW) => {
      return User.create({
        username,
        passwordHash: hashedPW,
      });
    })
    .then(() => {
      res.render("/index"); // PUT HERE LOGIN PAGE ONCE WE HAVE IT
    });
});

module.exports = authRouter;
