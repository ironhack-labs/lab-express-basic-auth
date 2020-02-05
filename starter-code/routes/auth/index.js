const express = require("express");
const router = express.Router();
const db = require("../../dbHelpers");
const bcrypt = require("bcrypt");

router.get("/signin", (req, res) => {
  res.render("auth/signin");
});

router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  const user = await db.findUser({ username });
  if (!user) {
    console.log("Username was not found");
    res.redirect("/signin");
  } else {
    const passwordIsCorrect = await bcrypt.compare(password, user.password);
    if (!passwordIsCorrect) {
      // console.log("Password is not correct");
      req.flash("error", `We couldn't log you in. Please verify your credentials.`);
      res.redirect("/signin");
    } else {
      req.session.user = { username: user.username, id: user._id };
      req.flash("success", `Welcome back ${user.username}`);
      // console.log("OK, username and password match. You're logged in");
      // console.log(req.session.user);
      res.redirect("/");
    }
  }
});

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res) => {
  let { username, password } = req.body;
  if (!username || !password) {
    res.redirect("/signup");
  } else {
    const user = await db.findUser({ username: username });
    if (user) {
      // console.log("Can't create a user with an already existing username");
      req.flash("error", "Can't create a user with an already existing username.");
      res.redirect("/signup");
    } else {
      password = await bcrypt.hash(password, 10);
      // console.log("Hashed password", password);
      const newUser = await db.createUser(username, password);
      // console.log("New user created!", newUser);
      req.flash("success", "Congratulations! You are now part of the community.");
      req.session.user = { username: newUser.username, id: newUser._id };
      res.redirect("/");
    }
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.locals.user = undefined;
    res.locals.isLogged = false;
  });
  res.redirect("/");
});

module.exports = router;
