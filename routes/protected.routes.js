const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/main", (req, res, next) => {
  let user = req.session.loggedInUser;
  if (!user) {
    res.redirect("/signin");
  } else {
    res.render("protected/main.hbs");
  }
});

router.get("/private", (req, res, next) => {
    let user = req.session.loggedInUser;
    if (!user) {
      res.redirect("/signin");
    } else {
      res.render("protected/private.hbs");
    }
  });

module.exports = router;
