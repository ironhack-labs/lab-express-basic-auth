const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/private", (req, res) => {
  if (req.session.currentUser){
    res.render("private");
  } else {
    res.redirect("/auth/login");
  }
})

module.exports = router;