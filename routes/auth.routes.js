const { Router } = require("express");
const router = new Router();
const bcryptjs = require("bcryptjs");

const User = require("../models/User.model");

const saltRounds = 10;

//GET router

router.get("/signup", (req, res, next) => res.render("auth/signup"));

//POST router
router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;
  const salt = bcryptjs.genSaltSync(saltRounds);
  const hashPass = bcryptjs.hashSync(password, salt);
  await User.create({ username, password: hashPass });
  res.render("index");
});

module.exports = router;
