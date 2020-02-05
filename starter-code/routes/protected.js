let express = require("express");
let router = express.Router();
let User = require("../models/User");

router.get("/main", (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  res.render("main.hbs");
});

module.exports = router;
