const express = require("express");
const router = express.Router();

function requireLogin(req, res, next){
    if (req.session.banana) {
      next();
    } else {
      res.redirect("/login");
    }
  }

router.get("/private", requireLogin, (req, res) => {
    res.render("private");
});

module.exports = router;