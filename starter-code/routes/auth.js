const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { hashPassword, checkHashed } = require("../lib/hashing");

router.get("/register", async (req, res, next) => {
  res.render("auth/register");
});

router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  // VAMOS POR AQUÍ <-------------------------------
});

router.get("/login", async (req, res, next) => {
  res.render("auth/login");
});

module.exports = router;
