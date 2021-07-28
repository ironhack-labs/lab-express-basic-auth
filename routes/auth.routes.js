// routes/auth.routes.js

const express = require("express");
const router = express.Router();

// GET route ==> to display the signup form to users.
router.get("/signup", (req, res, next) => res.render("auth/signup.hbs"));

// POST route ==> to process form data.
router.post("signup", (req, res, next) => {
  console.log("data: ", req.body);
});

module.exports = router;
