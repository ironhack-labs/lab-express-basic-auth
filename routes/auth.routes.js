const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("./../models/User.model");
const saltRounds = 10

router.get("/sign-up", (req, res) => {
  res.render("auth/signup-form");
});

router.post("/sign-up", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const salt = bcrypt.genSaltSync(saltRounds); // crea la pass
    const hashedPassword = bcrypt.hashSync(password, salt); // la fusiona con la del usuario
    await User.create({ username, password: hashedPassword });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
