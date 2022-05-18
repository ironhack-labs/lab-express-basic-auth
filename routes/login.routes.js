const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

router.get("/", (req, res, next) => {
  res.render("auth/login");
});

router.post("/", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    const message = `Missing username or password`;
    res.render("auth/login", { message });
    return;
  }

  try {
    // check if username exists
    const userExists = await User.findOne({ username });
    if (!userExists) {
      const message = `User not found`;
      res.render("auth/login", { message });
    }

    // check if password matches
    const passwordMatch = bcrypt.compareSync(password, userExists.password);
    console.log(passwordMatch);
    if (passwordMatch) {
      // create active session QUESTION
      /*  req.session.loggedInUser = username;
      req.app.locals.isLoggedIn = true; */
      res.redirect("/auth/main");
    } else {
      const message = `Wrong password`;
      res.render("auth/login", { message });
      return;
    }

    // change userExists to object, delete pw
    const objectUser = userExists.toObject();
    delete objectUser.password;
    // save current user in session
    req.session.currentUser = objectUser;
  } catch (error) {
    next(error);
  }
});

module.exports = router;
