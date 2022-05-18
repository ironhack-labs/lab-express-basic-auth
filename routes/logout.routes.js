const router = require("express").Router();
const User = require("../models/User.model");

router.get("/", (req, res, next) => {
  req.session.destroy();
  res.redirect("/auth/login");
});

module.exports = router;
