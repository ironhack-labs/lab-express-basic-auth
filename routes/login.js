const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const UserModel = require("../models/User.model");

router.get("/login", async (req, res, next) => {
  try {
    await res.render("login");
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const {username, password} = req.body;
    const foundUser = await UserModel.findOne({ username: username });
    if (!foundUser) {
        console.log("Not found")
      res.redirect("/sigin");
    } else {
      const isSamePassword = bcrypt.compareSync(password, foundUser.password);
    }

    if (!isSamePassword) {
        console.log("Password wrong")
      res.redirect("/signin");
    } else {
      const userObject = foundUser.toObject();
      delete userObject.password;

      req.session.currentUser = userObject;

      req.flash("success", "Welcome to your account");
      res.redirect("/");
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
