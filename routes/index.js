const router = require("express").Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// GET home page
router.get("/", (req, res, next) => {
  res.render("index");
});

// GET signup page
router.get("/signup", (req, res) => {
  res.render("signup");
});

// POST signup
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.render("signup", { errorMessage: "All fields are mandatory." });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.render("signup", { errorMessage: "Username already exists." });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    await User.create({
      username,
      password: hashedPassword
    });
    res.redirect("/login");
  } catch (error) {
    res.render("signup", { errorMessage: "Something went wrong. Please try again." });
  }
});

// GET login page
router.get("/login", (req, res) => {
  res.render("login");
});

// POST login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.render("login", { errorMessage: "All fields are mandatory." });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.render("login", { errorMessage: "Invalid credentials." });
    }

    const passwordCorrect = bcrypt.compareSync(password, user.password);
    if (!passwordCorrect) {
      return res.render("login", { errorMessage: "Invalid credentials." });
    }

    req.session.currentUser = user;
    res.redirect("/main");
  } catch (error) {
    res.render("login", { errorMessage: "Something went wrong. Please try again." });
  }
});

// GET main page - protected route
router.get("/main", authMiddleware, (req, res) => {
  res.render("main");
});

module.exports = router;
