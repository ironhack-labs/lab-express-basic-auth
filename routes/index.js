const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

// GET home page
router.get("/", (req, res, next) => {
  res.render("index");
});

// GET login page
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

// POST login
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const userFromDb = await User.findOne({ username });

    if (userFromDb) {
      if (bcrypt.compareSync(password, userFromDb.password)) {
        req.session.currentUser = userFromDb;
        res.redirect("/private");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password" });
      }
    } else {
      res.render("auth/login", { errorMessage: "User not found" });
    }
  } catch (error) {
    res.render("auth/login", { errorMessage: "Error logging in" });
  }
});

module.exports = router;
