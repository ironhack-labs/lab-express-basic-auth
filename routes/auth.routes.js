const router = require("express").Router();
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const saltRounds = 12;
const { isLoggedIn, isLoggedOut } = require("../middlewares/route-guard.js");

router.get("/signup", isLoggedOut, (req, res) => {
  console.log("render succesful");
  res.render("auth/signup");
});

router.post("/signup", async (req, res, next) => {
  const salt = await bcryptjs.genSalt(saltRounds);
  const hash = await bcryptjs.hash(req.body.password, salt);
  console.log(hash);

  const user = new User({ username: req.body.username, password: hash });
  console.log(user);
  await user.save();

  res.send("signed up");
});

router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

router.post("/login", async (req, res, next) => {
  // receive information from the form
  try {
    // get username from database
    const userFromDataBase = await User.findOne({ username: req.body.username });
    console.log("User from database is: ", userFromDataBase);

    // do something when username is incorrect
    if (!userFromDataBase) {
      res.send("The username is incorrect");
    }

    // compare password to data in database
    const passwordMatch = await bcryptjs.compare(req.body.password, userFromDataBase.password);
    console.log("The password match is: ", passwordMatch);

    if (!passwordMatch) {
      res.send("The password is incorrect");
    } else {
      console.log("render profile succces");
      res.render("profile");
      //   res.send("render succes");
    }

    // store the sessions
    req.session.userFromDataBase = { username: userFromDataBase.username };
    res.redirect("/profile");
  } catch (err) {
    next(err);
  }
  console.log("SESSION =====> ", req.session);
});

module.exports = router;
