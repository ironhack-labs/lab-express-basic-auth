const express = require("express");
const router = express.Router();

router.get("/main", (req, res, next) => {
  let session = req.session.;
  if (!session) {
    res.redirect("/login");
  } else {
    res.render("main.hbs");
  }
});
router.get("/private", (req, res, next) => {
  let session = req.session.;
  if (!session) {
    res.redirect("/login");
  } else {
    res.render("private.hbs");
  }
});

module.exports = router;