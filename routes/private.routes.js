const router = require("express").Router();

//Model
const User = require("../models/User.model");

const { isLoggedIn } = require("../middleware/routes-guard");

router.get("/main", isLoggedIn, (req, res) => {
  const { username } = req.session.loggedUser;
  res.render("main", { username });
});

router.get("/private", isLoggedIn, (req, res) => {
    const { username } = req.session.loggedUser;
    res.render("private", { username });
  });

module.exports = router;