const router = require("express").Router();
// const User = require("../models/User.model");
// const bcrypt = require("bcryptjs");

router.get("/main", (req, res, next) => {
  res.render("main");
});

module.exports = router;