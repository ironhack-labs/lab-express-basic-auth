const express = require("express");
const router = express.Router();
const Users = require("../models/User");
const { hashPassword, checkHashed } = require("../lib/hashing");

// Show the list celebrity in celebrity/index
router.get("/", async (req, res, next) => {
  res.render("auth/register");
});

// Create: Submit & Process form data
router.post("/", async (req, res, next) => {
  const { name, lastname, country, username, password, accept } = req.body;
  const existingUser = await Users.findOne({ username });
  if (!existingUser) {
    const addUser = new Users({
      name,
      lastname,
      country,
      username,
      password: hashPassword(password),
      accept: accept ? true : false
    });
    console.log(`create the ${username}`);
    await addUser.save();
    res.redirect("/");
  } else {
    console.log(`exist the ${username}`);
    res.render("auth/register");
  }
});

module.exports = router;
