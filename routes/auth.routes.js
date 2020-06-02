const express = require("express");
const router = express.Router();

const UserModel = require("../models/User.model");

router.get("/signup", (req,res) => {
  res.render("auth/signup.hbs")
})

module.exports = router;