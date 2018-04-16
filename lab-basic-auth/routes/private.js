
const express = require('express');
const router  = express.Router();

router.use((req, res, next) => {
  if (req.session.currentUser) {
    console.log("privado")
    next();
  } else {
    res.redirect("/login");
  }
});

router.get("/", (req, res, next) => {
  res.render("private");
});

module.exports = router;
