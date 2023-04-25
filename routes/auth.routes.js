const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const isLoggedOut = require("../middlewares/isLoggedOut");

const router = require("express").Router();

router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect("/");
  });
});

router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email });

  if (existingUser) {
    return res.render("auth/accexist", {
      error: "Email already exists"
    });
  }

  const salt = await bcryptjs.genSalt(12);
  const hash = await bcryptjs.hash(req.body.password, salt);

  const user = new User({ email: req.body.email, password: hash });
  await user.save();

  res.render("auth/signupsuccess");
});


router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    console.log(user);

    if (!user) {
      return res.render("auth/login", { error: "User not from this planet" });
    }

    const passwordsMatch = await bcryptjs.compare(
      req.body.password,
      user.password
    );

    if (!passwordsMatch) {
      return res.render("auth/login", {
        error: "Incorrect password!",
      });
    }

    req.session.user = {
      email: user.email,
      };

    console.log(req.body);
    res.redirect("/profile");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
