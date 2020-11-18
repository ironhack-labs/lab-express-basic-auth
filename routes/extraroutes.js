const express = require("express");
const router = require("./index.routes");

const shouldBeAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.render("index", { errMessage: "YOU MUST BE LOGGED IN" });
  }
  next();
};

//!NEEDS TO BE AUTENTICATED
router.get("/main", shouldBeAuthenticated, (req, resp, next) => {
  resp.render("extraroutes/main");
});

router.get("/private", shouldBeAuthenticated, (req, resp, next) => {
  resp.render("extraroutes/private");
});

module.exports = router;
