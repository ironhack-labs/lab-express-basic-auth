const express = require("express");
const router = express.Router();

const shouldBeAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    console.log("You need to be logged in to view that page");
    return res.redirect("/");
  }
  next();
};

router.get("/private", shouldBeAuthenticated, (req, res, next) =>
  res.render("priv/private")
);

router.get("/main", shouldBeAuthenticated, (req, res, next) =>
  res.render("priv/main")
);

module.exports = router;
