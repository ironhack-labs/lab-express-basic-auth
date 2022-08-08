const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const isLoggedIn = require("../middleware/isLoggedIn.middleware");

router.get("/", isLoggedIn, (req, res) => {
  res.render("user/welcome");
});

router.get("/:id", isLoggedIn, (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      const { username } = user;
      res.render("user/profile", { username });
    })
    .catch((err) => console.log("Failure loading profile page", err));
});

module.exports = router;
