const express = require("express");
const router = express.Router();
const UserModel = require("../models/User.model");
const bcryptjs = require("bcryptjs");

router.get("/signup", (req, res) => {
  res.render("auth/signup.hbs");
});
router.get("/login", (req, res) => {
  res.render("auth/login.hbs");
});

router.post("/signup", async (req, res) => {
  try {
    let response = await UserModel.findOne({ username: req.body.username });
    if (!response) {
      const salt = bcryptjs.genSaltSync(12);
      const hashedPassword = bcryptjs.hashSync(req.body.password, salt);
      const newUser = await UserModel.create({
        ...req.body,
        password: hashedPassword,
      });
      res.redirect("/auth/login");
    } else {
      res.render("auth/signup", { errorMessage: "Username already taken" });
    }
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;