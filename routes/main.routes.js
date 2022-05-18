const router = require("express").Router();
const User = require("../models/User.model");

router.get("/", (req, res, next) => {
  res.render("auth/main");
});

module.exports = router;
