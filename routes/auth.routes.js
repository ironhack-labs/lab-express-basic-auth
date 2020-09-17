const { Router } = require("express");
const router = new Router();

// Import function from util folder for ecrypt the password
const { encrypt } = require("../util/auth");

// Import User model
const User = require("../models/User.model");

// GET Signup Form
router.get("/signup", (req, res) => res.render("auth/signup", {layout: false}));

// Post Recive data from the form and create user in db
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Encrypt the password
    const passwordHash = await encrypt(password);

    // Create the user in the db
    const result = await User.create({ username, email, passwordHash });

    res.redirect("/signup");
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
