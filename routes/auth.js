const bcryptjs = require("bcryptjs");
const isLoggedIn = require("../middlewares/isLoggedIn");
const User = require("../models/User.model");
const router = require("express").Router();
const saltRounds = 12;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res, next) => {
  try {
    const salt = await bcryptjs.genSalt(saltRounds);
    console.log(salt);

    const hash = await bcryptjs.hash(req.body.password, salt);
    console.log(hash);

    // also a way of creating and saving new user:
    // const newUser = new User({ username: req.body.username, password: hash });
    // await newUser.save();

    //short way to create and save new user:
    await User.create({ username: req.body.username, password: hash });

    res.redirect("/profile"); 
  } catch (err) {
    console.log("there was an error", err);
    res.redirect("/profile");
  }
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    console.log(user);

    if (!user) {
      return res.render("auth/login", { error: "User not existent" });
    }

    const passwordsMatch = await bcryptjs.compare(
      req.body.password,
      user.password
    );

    if (!passwordsMatch) {
      return res.render("auth/login", {
        error: "Sorry the password is incorrect!",
      });
    }

    req.session.user = {
      email: user.email,
      // you can adapt this to hold more data and info
      // admin: user.admin
    };

    console.log(req.body);
    res.redirect("/profile");
  } catch (err) {
    next(err);
  }
});

router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect("/");
  });
});

router.get("/main", isLoggedIn, (req, res, next) => {
  res.render("auth/main"); 
});

router.get("/private", isLoggedIn,(req, res, next) => {
  res.render("auth/private");
});

module.exports = router;
