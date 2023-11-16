const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return res.render("auth/login", { error: "Invalid email or password" });
    }

    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    res.redirect("/profile");
  } catch (error) {
    console.error("Error logging in:", error);
    res.render("auth/login", { error: "Failed to log in." });
  }
});

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      passwordHash: hashedPassword,
    });

    req.session.user = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    };

    res.redirect("/profile");
  } catch (error) {
    console.error("Error creating user: ", error);
    res.render("auth/signup", { error: "Failed to create user." });
  }
});

router.get("/profile", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  res.render("auth/profile", { user: req.session.user });
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error logging out:", err);
    }
    res.redirect("/login");
  });
});

module.exports = router;
